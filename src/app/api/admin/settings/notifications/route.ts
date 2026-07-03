import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'

declare global {
  var notificationSettings: NotificationSettings | undefined
}

interface NotificationSettings {
  id?: string
  enableEmailNotifications: boolean
  enableSMSNotifications: boolean
  enableKYCApprovalSMS: boolean
  enableKYCRejectionSMS: boolean
  enableKYCUnderReviewSMS: boolean
  enableTransactionSMS: boolean
  smsOnlyForCritical: boolean
  emailTemplate: string
  smsTemplate: string
  createdAt?: Date
  updatedAt?: Date
}

// GET /api/admin/settings/notifications - Get notification settings
export async function GET(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request)
  if (error || !user) return createErrorResponse('Unauthorized', 401)

  try {
    const settings: NotificationSettings = {
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      enableKYCApprovalSMS: false,
      enableKYCRejectionSMS: true,
      enableKYCUnderReviewSMS: false,
      enableTransactionSMS: false,
      smsOnlyForCritical: true,
      emailTemplate: 'default',
      smsTemplate: 'default',
    }

    return NextResponse.json({
      success: true,
      settings,
    })

  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings/notifications - Update notification settings
export async function POST(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request)
  if (error || !user) return createErrorResponse('Unauthorized', 401)

  try {
    const body = await request.json()
    const {
      enableEmailNotifications = true,
      enableSMSNotifications = false,
      enableKYCApprovalSMS = false,
      enableKYCRejectionSMS = true,
      enableKYCUnderReviewSMS = false,
      enableTransactionSMS = false,
      smsOnlyForCritical = true,
      emailTemplate = 'default',
      smsTemplate = 'default',
    } = body

    const settings: NotificationSettings = {
      enableEmailNotifications,
      enableSMSNotifications,
      enableKYCApprovalSMS,
      enableKYCRejectionSMS,
      enableKYCUnderReviewSMS,
      enableTransactionSMS,
      smsOnlyForCritical,
      emailTemplate,
      smsTemplate,
      updatedAt: new Date(),
    }

    global.notificationSettings = settings

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings,
    })

  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification settings' },
      { status: 500 }
    )
  }
}

// Helper function to get current notification settings
export async function getNotificationSettings(): Promise<NotificationSettings> {
  return global.notificationSettings || {
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enableKYCApprovalSMS: false,
    enableKYCRejectionSMS: true,
    enableKYCUnderReviewSMS: false,
    enableTransactionSMS: false,
    smsOnlyForCritical: true,
    emailTemplate: 'default',
    smsTemplate: 'default',
  }
}
