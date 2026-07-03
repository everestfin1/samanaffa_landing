import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  loadNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from '@/lib/notification-settings';

export async function GET(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const settings = await loadNotificationSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching notification settings:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification settings' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request);
  if (error || !user) return createErrorResponse('Unauthorized', 401);

  try {
    const body = await request.json();
    const settings: NotificationSettings = {
      enableEmailNotifications:
        body.enableEmailNotifications ?? DEFAULT_NOTIFICATION_SETTINGS.enableEmailNotifications,
      enableSMSNotifications:
        body.enableSMSNotifications ?? DEFAULT_NOTIFICATION_SETTINGS.enableSMSNotifications,
      enableKYCApprovalSMS:
        body.enableKYCApprovalSMS ?? DEFAULT_NOTIFICATION_SETTINGS.enableKYCApprovalSMS,
      enableKYCRejectionSMS:
        body.enableKYCRejectionSMS ?? DEFAULT_NOTIFICATION_SETTINGS.enableKYCRejectionSMS,
      enableKYCUnderReviewSMS:
        body.enableKYCUnderReviewSMS ?? DEFAULT_NOTIFICATION_SETTINGS.enableKYCUnderReviewSMS,
      enableTransactionSMS:
        body.enableTransactionSMS ?? DEFAULT_NOTIFICATION_SETTINGS.enableTransactionSMS,
      smsOnlyForCritical:
        body.smsOnlyForCritical ?? DEFAULT_NOTIFICATION_SETTINGS.smsOnlyForCritical,
      emailTemplate: body.emailTemplate ?? DEFAULT_NOTIFICATION_SETTINGS.emailTemplate,
      smsTemplate: body.smsTemplate ?? DEFAULT_NOTIFICATION_SETTINGS.smsTemplate,
    };

    const saved = await saveNotificationSettings(settings);

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: saved,
    });
  } catch (err) {
    console.error('Error updating notification settings:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification settings' },
      { status: 500 },
    );
  }
}
