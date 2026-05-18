import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { db } from '@/lib/db';
import { transactionIntents } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { KycStatus, NotificationPriority, NotificationType } from '@/lib/types';
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications';
import { getServerSideNotificationSettings, shouldSendKYCSMS, shouldSendKYCEmail } from '@/lib/notification-settings';

// ── Signature verification ─────────────────────────────────────────────────
// Implements Didit V2: HMAC-SHA256 of "{timestamp}:{canonical_json}"
// canonical_json = JSON.stringify with sorted keys, floats→ints for whole numbers
function sortedStringify(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortedStringify);
  if (v !== null && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as Record<string, unknown>).sort()) {
      out[k] = sortedStringify((v as Record<string, unknown>)[k]);
    }
    return out;
  }
  if (typeof v === 'number' && Number.isFinite(v) && v === Math.trunc(v)) return Math.trunc(v);
  return v;
}

function verifySignatureV2(body: object, signature: string, timestamp: string, secret: string): boolean {
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const canonical = JSON.stringify(sortedStringify(body));
  const message = `${timestamp}:${canonical}`;
  const expected = createHmac('sha256', secret).update(message).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}

// ── Didit status → our kycStatus mapping ──────────────────────────────────
const DIDIT_STATUS_MAP: Record<string, { kycStatus: string; docStatus: string }> = {
  Approved:  { kycStatus: 'APPROVED',      docStatus: 'APPROVED' },
  Declined:  { kycStatus: 'REJECTED',      docStatus: 'REJECTED' },
  'In Review': { kycStatus: 'UNDER_REVIEW', docStatus: 'UNDER_REVIEW' },
};

// ── Route ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Verify HMAC signature if secret is configured
  const secret = process.env.DIDIT_WEBHOOK_SECRET;
  if (secret) {
    const sigV2  = request.headers.get('X-Signature-V2') ?? '';
    const tsHeader = request.headers.get('X-Timestamp') ?? '';
    if (!sigV2 || !verifySignatureV2(body, sigV2, tsHeader, secret)) {
      console.warn('[webhooks/didit] Invalid signature — rejected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  } else {
    console.warn('[webhooks/didit] DIDIT_WEBHOOK_SECRET not set — skipping signature check');
  }

  const { session_id, status, vendor_data: userId } = body as {
    session_id?: string;
    status?: string;
    vendor_data?: string;
    webhook_type?: string;
  };

  // Only act on terminal / actionable statuses
  if (!session_id || !status || !userId) {
    return NextResponse.json({ received: true });
  }

  const mapped = DIDIT_STATUS_MAP[status];
  if (!mapped) {
    return NextResponse.json({ received: true });
  }

  try {
    // Find the most recent pending kycDocument for this Didit session
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
      console.error(`[webhooks/didit] No kycDocument found for userId=${userId}`);
      return NextResponse.json({ received: true });
    }

    // Update the kycDocument status
    await prisma.kycDocument.update({
      where: { id: doc.id },
      data: { verificationStatus: mapped.docStatus },
    });

    const user = (doc as any).user;
    if (!user || user.kycStatus === mapped.kycStatus) {
      return NextResponse.json({ received: true });
    }

    // Update user kycStatus
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: mapped.kycStatus as KycStatus },
    });

    // Cancel pending deposit intents on REJECTED, release them on APPROVED
    if (mapped.kycStatus === 'REJECTED') {
      try {
        await db
          .update(transactionIntents)
          .set({ status: 'CANCELLED', awaitingKycApproval: false, adminNotes: 'Auto-cancelled: KYC rejected via Didit' })
          .where(
            and(
              eq(transactionIntents.userId, userId),
              eq(transactionIntents.awaitingKycApproval, true),
            )!
          );
      } catch (e) {
        console.error('[webhooks/didit] Error cancelling deposit intents:', e);
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
            )!
          );
      } catch (e) {
        console.error('[webhooks/didit] Error releasing deposit intents:', e);
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
            metadata: JSON.stringify({ kycStatus: mapped.kycStatus, diditSessionId: session_id }),
          },
        });
      } catch (e) {
        console.error('[webhooks/didit] Error creating notification:', e);
      }
    }

    // Email + SMS notifications
    const notifSettings = getServerSideNotificationSettings();
    if (shouldSendKYCEmail(mapped.kycStatus as any, notifSettings)) {
      try {
        await sendKYCStatusEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
          mapped.kycStatus as any,
        );
      } catch (e) {
        console.error('[webhooks/didit] Error sending KYC email:', e);
      }
    }
    if (shouldSendKYCSMS(mapped.kycStatus as any, notifSettings)) {
      try {
        await sendKYCStatusSMS(user.phone, mapped.kycStatus as any);
      } catch (e) {
        console.error('[webhooks/didit] Error sending KYC SMS:', e);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhooks/didit]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
