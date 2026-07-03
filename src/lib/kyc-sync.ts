import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments, users } from '@/lib/db/schema'
import { updateOnboardingDepositIntentsForKycStatus } from '@/lib/kyc-deposit-intents'
import { KycStatus, NotificationPriority, NotificationType } from '@/lib/types'
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications'
import {
  getServerSideNotificationSettings,
  shouldSendKYCSMS,
  shouldSendKYCEmail,
} from '@/lib/notification-settings'
import {
  createUserNotification,
  sanitizeNotificationActionUrl,
} from '@/lib/user-notifications'
import { isOnboardingInProgress } from '@/lib/onboarding-progress'
import {
  buildRedactedDecisionPayload,
  buildUserPatchFromDiditIdentity,
  fetchDiditDecision,
  parseDiditIdentity,
} from '@/lib/didit-decision'
import { persistDiditAssets } from '@/lib/storage/didit-assets'

/**
 * Maps a Didit terminal status to our internal kycStatus / docStatus.
 * Returns `null` for non-terminal statuses we don't act on.
 */
export const DIDIT_STATUS_MAP: Record<string, { kycStatus: string; docStatus: string }> = {
  Approved: { kycStatus: 'APPROVED', docStatus: 'APPROVED' },
  Declined: { kycStatus: 'REJECTED', docStatus: 'REJECTED' },
  'In Review': { kycStatus: 'UNDER_REVIEW', docStatus: 'UNDER_REVIEW' },
}

const userSelectForKyc = {
  id: users.id,
  firstName: users.firstName,
  lastName: users.lastName,
  email: users.email,
  phone: users.phone,
  kycStatus: users.kycStatus,
  dateOfBirth: users.dateOfBirth,
  nationality: users.nationality,
  country: users.country,
  address: users.address,
  city: users.city,
  idType: users.idType,
  idNumber: users.idNumber,
  idExpiryDate: users.idExpiryDate,
  placeOfBirth: users.placeOfBirth,
  investorProfile: users.investorProfile,
}

/**
 * Syncs our DB with a Didit terminal decision.
 * Fetches full decision payload, stores redacted snapshot, applies identity to user on approval.
 */
export async function syncDiditDecision(
  userId: string,
  diditStatus: string,
  sessionId: string,
): Promise<boolean> {
  const mapped = DIDIT_STATUS_MAP[diditStatus]
  if (!mapped) return false

  const [doc] = await db
    .select()
    .from(kycDocuments)
    .where(and(eq(kycDocuments.userId, userId), eq(kycDocuments.documentType, 'didit_kyc_session')))
    .orderBy(desc(kycDocuments.uploadDate))
    .limit(1)

  if (!doc) {
    console.warn(`[kyc-sync] No kycDocument found for userId=${userId}`)
    return false
  }

  const [user] = await db
    .select(userSelectForKyc)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    console.warn(`[kyc-sync] No user found for userId=${userId}`)
    return false
  }

  const decision = await fetchDiditDecision(sessionId)
  if (decision) {
    try {
      await db
        .update(kycDocuments)
        .set({ diditDecisionPayload: buildRedactedDecisionPayload(decision) })
        .where(eq(kycDocuments.id, doc.id))
    } catch (e) {
      console.error('[kyc-sync] Error storing decision payload:', e)
    }

    try {
      await persistDiditAssets(userId, sessionId, mapped.docStatus, decision)
    } catch (e) {
      console.error('[kyc-sync] Error persisting Didit assets:', e)
    }
  }

  const alreadySynced = doc.verificationStatus === mapped.docStatus

  if (!alreadySynced) {
    await db
      .update(kycDocuments)
      .set({ verificationStatus: mapped.docStatus as typeof doc.verificationStatus })
      .where(eq(kycDocuments.id, doc.id))
  }

  if (mapped.kycStatus === 'APPROVED' && decision) {
    const identity = parseDiditIdentity(decision)
    if (identity) {
      const identityPatch = buildUserPatchFromDiditIdentity(user, identity)
      if (Object.keys(identityPatch).length > 0) {
        try {
          await db.update(users).set(identityPatch).where(eq(users.id, userId))
        } catch (e) {
          console.error('[kyc-sync] Error applying Didit identity:', e)
        }
      }
    }
  }

  if (user.kycStatus === mapped.kycStatus) {
    return !alreadySynced
  }

  await db
    .update(users)
    .set({ kycStatus: mapped.kycStatus as KycStatus })
    .where(eq(users.id, userId))

  if (mapped.kycStatus === 'REJECTED' || mapped.kycStatus === 'APPROVED') {
    await updateOnboardingDepositIntentsForKycStatus(
      userId,
      mapped.kycStatus as 'APPROVED' | 'REJECTED',
    )
  }

  const notifMap: Record<
    string,
    { title: string; message: string; type: string; priority: string; actionUrl?: string }
  > = {
    APPROVED: {
      title: 'Identité vérifiée ✅',
      message:
        'Votre identité est validée. Indiquez votre email et vos préférences, puis confirmez votre versement sur Sama Naffa.',
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
  }

  const notif = notifMap[mapped.kycStatus]
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
        ...(notif.actionUrl
          ? { actionUrl: sanitizeNotificationActionUrl(notif.actionUrl) }
          : {}),
      },
    })
  }

  const notifSettings = getServerSideNotificationSettings()
  const emailKycStatus = mapped.kycStatus as 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'
  if (!alreadySynced && shouldSendKYCEmail(emailKycStatus, notifSettings)) {
    try {
      await sendKYCStatusEmail(user.email, `${user.firstName} ${user.lastName}`, emailKycStatus)
    } catch (e) {
      console.error('[kyc-sync] Error sending KYC email:', e)
    }
  }
  if (!alreadySynced && shouldSendKYCSMS(emailKycStatus, notifSettings)) {
    const skipRejectionSmsDuringOnboarding =
      mapped.kycStatus === 'REJECTED' && isOnboardingInProgress(user.investorProfile)
    if (!skipRejectionSmsDuringOnboarding) {
      try {
        await sendKYCStatusSMS(user.phone, emailKycStatus)
      } catch (e) {
        console.error('[kyc-sync] Error sending KYC SMS:', e)
      }
    }
  }

  return true
}
