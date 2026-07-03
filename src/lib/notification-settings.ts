import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  ADMIN_NOTIFICATION_SETTINGS_ID,
  adminNotificationSettings,
  type AdminNotificationSettings,
} from '@/lib/db/schema';

export interface NotificationSettings {
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  enableKYCApprovalSMS: boolean;
  enableKYCRejectionSMS: boolean;
  enableKYCUnderReviewSMS: boolean;
  enableTransactionSMS: boolean;
  smsOnlyForCritical: boolean;
  emailTemplate: string;
  smsTemplate: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enableEmailNotifications: true,
  enableSMSNotifications: false,
  enableKYCApprovalSMS: false,
  enableKYCRejectionSMS: true,
  enableKYCUnderReviewSMS: false,
  enableTransactionSMS: false,
  smsOnlyForCritical: true,
  emailTemplate: 'default',
  smsTemplate: 'default',
};

function rowToSettings(row: AdminNotificationSettings): NotificationSettings {
  return {
    enableEmailNotifications: row.enableEmailNotifications,
    enableSMSNotifications: row.enableSMSNotifications,
    enableKYCApprovalSMS: row.enableKYCApprovalSMS,
    enableKYCRejectionSMS: row.enableKYCRejectionSMS,
    enableKYCUnderReviewSMS: row.enableKYCUnderReviewSMS,
    enableTransactionSMS: row.enableTransactionSMS,
    smsOnlyForCritical: row.smsOnlyForCritical,
    emailTemplate: row.emailTemplate,
    smsTemplate: row.smsTemplate,
  };
}

/** Load notification settings from Postgres (singleton row). */
export async function loadNotificationSettings(): Promise<NotificationSettings> {
  const [row] = await db
    .select()
    .from(adminNotificationSettings)
    .where(eq(adminNotificationSettings.id, ADMIN_NOTIFICATION_SETTINGS_ID))
    .limit(1);

  return row ? rowToSettings(row) : DEFAULT_NOTIFICATION_SETTINGS;
}

/** Upsert notification settings to Postgres. */
export async function saveNotificationSettings(
  settings: NotificationSettings,
): Promise<NotificationSettings> {
  const [existing] = await db
    .select({ id: adminNotificationSettings.id })
    .from(adminNotificationSettings)
    .where(eq(adminNotificationSettings.id, ADMIN_NOTIFICATION_SETTINGS_ID))
    .limit(1);

  const payload = { ...settings, updatedAt: new Date() };

  const [row] = existing
    ? await db
        .update(adminNotificationSettings)
        .set(payload)
        .where(eq(adminNotificationSettings.id, ADMIN_NOTIFICATION_SETTINGS_ID))
        .returning()
    : await db
        .insert(adminNotificationSettings)
        .values({ id: ADMIN_NOTIFICATION_SETTINGS_ID, ...payload })
        .returning();

  return rowToSettings(row);
}

// Check if SMS should be sent for a specific KYC status
export function shouldSendKYCSMS(
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
  settings: NotificationSettings,
): boolean {
  switch (kycStatus) {
    case 'APPROVED':
      return settings.enableKYCApprovalSMS;
    case 'REJECTED':
      return settings.enableKYCRejectionSMS;
    case 'UNDER_REVIEW':
      return settings.enableKYCUnderReviewSMS;
    default:
      return false;
  }
}

export function shouldSendKYCEmail(
  kycStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
  settings: NotificationSettings,
): boolean {
  void kycStatus;
  return settings.enableEmailNotifications;
}

export function shouldSendTransactionSMS(settings: NotificationSettings): boolean {
  return settings.enableTransactionSMS;
}
