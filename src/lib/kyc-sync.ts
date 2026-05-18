import { prisma } from '@/lib/prisma';
import { db } from '@/lib/db';
import { transactionIntents } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { KycStatus, NotificationPriority, NotificationType } from '@/lib/types';
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications';
import { getServerSideNotificationSettings, shouldSendKYCSMS, shouldSendKYCEmail } from '@/lib/notification-settings';

/**
 * Maps a Didit terminal status to our internal kycStatus / docStatus.
 * Returns `null` for non-terminal statuses we don't act on.
 */
export const DIDIT_STATUS_MAP: Record<string, { kycStatus: string; docStatus: string }> = {
  Approved:    { kycStatus: 'APPROVED',      docStatus: 'APPROVED' },
  Declined:    { kycStatus: 'REJECTED',      docStatus: 'REJECTED' },
  'In Review': { kycStatus: 'UNDER_REVIEW',  docStatus: 'UNDER_REVIEW' },
};

/**
 * Syncs our DB with a Didit terminal decision.
 * Called by:
 * - POST /api/webhooks/didit   (production — triggered by Didit webhook)
 * - GET  /api/onboarding/kyc/status  (dev fallback — triggered by polling)
 *
 * Idempotent: if the kycDocument is already at the target status, this is a no-op.
 */
export async function syncDiditDecision(
  userId: string,
  diditStatus: string,
  sessionId: string,
): Promise<boolean> {
  const mapped = DIDIT_STATUS_MAP[diditStatus];
  if (!mapped) return false;

  // Find the most recent Didit kycDocument for this user
  const docs = await prisma.kycDocument.findMany({
    where: { userId, documentType: 'didit_kyc_session' },
    orderBy: { uploadDate: 'desc' },
    take: 1,
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, kycStatus: true },
      },
    },
  });

  const doc = docs[0];
  if (!doc) {
    console.warn(`[kyc-sync] No kycDocument found for userId=${userId}`);
    return false;
  }

  // Already synced — skip
  if (doc.verificationStatus === mapped.docStatus) return false;

  // Update kycDocument status
  await prisma.kycDocument.update({
    where: { id: doc.id },
    data: { verificationStatus: mapped.docStatus },
  });

  const user = (doc as any).user;
  if (!user || user.kycStatus === mapped.kycStatus) return true;

  // Update user kycStatus
  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: mapped.kycStatus as KycStatus },
  });

  // Cancel / release deposit intents
  if (mapped.kycStatus === 'REJECTED') {
    try {
      await db
        .update(transactionIntents)
        .set({
          status: 'CANCELLED',
          awaitingKycApproval: false,
          adminNotes: 'Auto-cancelled: KYC rejected via Didit',
        })
        .where(
          and(
            eq(transactionIntents.userId, userId),
            eq(transactionIntents.awaitingKycApproval, true),
          )!,
        );
    } catch (e) {
      console.error('[kyc-sync] Error cancelling deposit intents:', e);
    }
  } else if (mapped.kycStatus === 'APPROVED') {
    try {
      await db
        .update(transactionIntents)
        .set({ awaitingKycApproval: false })
        .where(
          and(
            eq(transactionIntents.userId, userId),
            eq(transactionIntents.awaitingKycApproval, true),
          )!,
        );
    } catch (e) {
      console.error('[kyc-sync] Error releasing deposit intents:', e);
    }
  }

  // In-app notification
  const notifMap: Record<string, { title: string; message: string; type: string; priority: string }> = {
    APPROVED: {
      title: 'Identité vérifiée ✅',
      message: 'Votre dossier KYC a été approuvé. Votre dépôt va être traité.',
      type: 'SUCCESS',
      priority: 'HIGH',
    },
    REJECTED: {
      title: 'Vérification non aboutie',
      message: 'Votre vérification KYC nécessite des corrections.',
      type: 'ERROR',
      priority: 'HIGH',
    },
    UNDER_REVIEW: {
      title: 'KYC en cours d\'examen',
      message: 'Notre équipe examine votre dossier (max 24h).',
      type: 'WARNING',
      priority: 'NORMAL',
    },
  };

  const notif = notifMap[mapped.kycStatus];
  if (notif) {
    try {
      await prisma.notification.create({
        data: {
          userId,
          title: notif.title,
          message: notif.message,
          type: notif.type as NotificationType,
          priority: notif.priority as NotificationPriority,
          metadata: JSON.stringify({ kycStatus: mapped.kycStatus, diditSessionId: sessionId }),
        },
      });
    } catch (e) {
      console.error('[kyc-sync] Error creating notification:', e);
    }
  }

  // Email + SMS
  const notifSettings = getServerSideNotificationSettings();
  if (shouldSendKYCEmail(mapped.kycStatus as any, notifSettings)) {
    try {
      await sendKYCStatusEmail(user.email, `${user.firstName} ${user.lastName}`, mapped.kycStatus as any);
    } catch (e) {
      console.error('[kyc-sync] Error sending KYC email:', e);
    }
  }
  if (shouldSendKYCSMS(mapped.kycStatus as any, notifSettings)) {
    try {
      await sendKYCStatusSMS(user.phone, mapped.kycStatus as any);
    } catch (e) {
      console.error('[kyc-sync] Error sending KYC SMS:', e);
    }
  }

  return true;
}
