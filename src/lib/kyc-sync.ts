import { prisma } from '@/lib/prisma';
import { updateOnboardingDepositIntentsForKycStatus } from '@/lib/kyc-deposit-intents';
import { KycStatus, NotificationPriority, NotificationType } from '@/lib/types';
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications';
import { getServerSideNotificationSettings, shouldSendKYCSMS, shouldSendKYCEmail } from '@/lib/notification-settings';
import { createUserNotification } from '@/lib/user-notifications';
import { isOnboardingInProgress } from '@/lib/onboarding-progress';
import {
  buildRedactedDecisionPayload,
  buildUserPatchFromDiditIdentity,
  fetchDiditDecision,
  parseDiditIdentity,
} from '@/lib/didit-decision';

/**
 * Maps a Didit terminal status to our internal kycStatus / docStatus.
 * Returns `null` for non-terminal statuses we don't act on.
 */
export const DIDIT_STATUS_MAP: Record<string, { kycStatus: string; docStatus: string }> = {
  Approved: { kycStatus: 'APPROVED', docStatus: 'APPROVED' },
  Declined: { kycStatus: 'REJECTED', docStatus: 'REJECTED' },
  'In Review': { kycStatus: 'UNDER_REVIEW', docStatus: 'UNDER_REVIEW' },
};

/**
 * Syncs our DB with a Didit terminal decision.
 * Fetches full decision payload, stores redacted snapshot, applies identity to user on approval.
 */
export async function syncDiditDecision(
  userId: string,
  diditStatus: string,
  sessionId: string,
): Promise<boolean> {
  const mapped = DIDIT_STATUS_MAP[diditStatus];
  if (!mapped) return false;

  const docs = await prisma.kycDocument.findMany({
    where: { userId, documentType: 'didit_kyc_session' },
    orderBy: { uploadDate: 'desc' },
    take: 1,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          kycStatus: true,
          dateOfBirth: true,
          nationality: true,
          country: true,
          address: true,
          city: true,
          idType: true,
          idNumber: true,
          idExpiryDate: true,
          placeOfBirth: true,
          investorProfile: true,
        },
      },
    },
  });

  const doc = docs[0];
  if (!doc) {
    console.warn(`[kyc-sync] No kycDocument found for userId=${userId}`);
    return false;
  }

  const decision = await fetchDiditDecision(sessionId);
  if (decision) {
    try {
      await prisma.kycDocument.update({
        where: { id: doc.id },
        data: {
          diditDecisionPayload: buildRedactedDecisionPayload(decision) as object,
        },
      });
    } catch (e) {
      console.error('[kyc-sync] Error storing decision payload:', e);
    }
  }

  const alreadySynced = doc.verificationStatus === mapped.docStatus;

  if (!alreadySynced) {
    await prisma.kycDocument.update({
      where: { id: doc.id },
      data: { verificationStatus: mapped.docStatus },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (doc as any).user as {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    kycStatus: string;
    dateOfBirth: Date | null;
    nationality: string | null;
    country: string | null;
    address: string | null;
    city: string | null;
    idType: string | null;
    idNumber: string | null;
    idExpiryDate: Date | null;
    placeOfBirth: string | null;
    investorProfile: unknown;
  } | undefined;
  if (!user) return true;

  if (mapped.kycStatus === 'APPROVED' && decision) {
    const identity = parseDiditIdentity(decision);
    if (identity) {
      const identityPatch = buildUserPatchFromDiditIdentity(user, identity);
      if (Object.keys(identityPatch).length > 0) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: identityPatch,
          });
        } catch (e) {
          console.error('[kyc-sync] Error applying Didit identity:', e);
        }
      }
    }
  }

  if (user.kycStatus === mapped.kycStatus) {
    return !alreadySynced;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: mapped.kycStatus as KycStatus },
  });

  if (mapped.kycStatus === 'REJECTED' || mapped.kycStatus === 'APPROVED') {
    await updateOnboardingDepositIntentsForKycStatus(
      userId,
      mapped.kycStatus as 'APPROVED' | 'REJECTED',
    );
  }

  const notifMap: Record<
    string,
    { title: string; message: string; type: string; priority: string; actionUrl?: string }
  > = {
    APPROVED: {
      title: 'Identité vérifiée ✅',
      message:
        'Votre identité est validée. Indiquez votre email et vos préférences, puis confirmez votre dépôt sur Sama Naffa.',
      type: 'SUCCESS',
      priority: 'HIGH',
      actionUrl: '/portal/sama-naffa?confirmDeposit=1',
    },
    REJECTED: {
      title: 'Vérification non aboutie',
      message: 'Votre vérification KYC nécessite des corrections.',
      type: 'ERROR',
      priority: 'HIGH',
    },
    UNDER_REVIEW: {
      title: "KYC en cours d'examen",
      message: 'Notre équipe examine votre dossier (max 24 h).',
      type: 'WARNING',
      priority: 'NORMAL',
    },
  };

  const notif = notifMap[mapped.kycStatus];
  if (notif && !alreadySynced) {
    await createUserNotification(userId, {
      title: notif.title,
      message: notif.message,
      type: notif.type as NotificationType,
      priority: notif.priority as NotificationPriority,
      metadata: {
        kycStatus: mapped.kycStatus,
        diditSessionId: sessionId,
        kind: 'kyc_status',
        ...(notif.actionUrl ? { actionUrl: notif.actionUrl } : {}),
      },
    });
  }

  const notifSettings = getServerSideNotificationSettings();
  const emailKycStatus = mapped.kycStatus as 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  if (!alreadySynced && shouldSendKYCEmail(emailKycStatus, notifSettings)) {
    try {
      await sendKYCStatusEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        emailKycStatus,
      );
    } catch (e) {
      console.error('[kyc-sync] Error sending KYC email:', e);
    }
  }
  if (!alreadySynced && shouldSendKYCSMS(emailKycStatus, notifSettings)) {
    const skipRejectionSmsDuringOnboarding =
      mapped.kycStatus === 'REJECTED' && isOnboardingInProgress(user.investorProfile);
    if (!skipRejectionSmsDuringOnboarding) {
      try {
        await sendKYCStatusSMS(user.phone, emailKycStatus);
      } catch (e) {
        console.error('[kyc-sync] Error sending KYC SMS:', e);
      }
    }
  }

  return true;
}
