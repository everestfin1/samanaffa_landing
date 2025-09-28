import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: session.user.email! }
    })

    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    // For now, we'll store settings in a simple JSON file approach
    // In a production system, you might want a dedicated settings table
    const settings: NotificationSettings = {
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      enableKYCApprovalSMS: false,
      enableKYCRejectionSMS: true, // Only critical rejections by default
      enableKYCUnderReviewSMS: false,
      enableTransactionSMS: false,
      smsOnlyForCritical: true,
      emailTemplate: 'default',
      smsTemplate: 'default'
    }

    // Try to get settings from database or file system
    // For simplicity, we'll use environment-based defaults but allow runtime overrides
    try {
      const existingSettings = await prisma.adminUser.findUnique({
        where: { id: adminUser.id },
        select: { 
          id: true,
          // We'll store settings in a JSON field if needed
        }
      })
      
      // You could extend AdminUser model to include notification settings
      // or create a separate NotificationSettings model
    } catch (error) {
      console.log('Using default notification settings')
    }

    return NextResponse.json({
      success: true,
      settings
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
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: session.user.email! }
    })

    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

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
      smsTemplate = 'default'
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
      updatedAt: new Date()
    }

    // Store settings (for now we'll use a simple approach)
    // In production, you might want to store this in a dedicated settings table
    // or extend the AdminUser model
    
    // For demonstration, we'll store in a global variable or file
    // In a real system, use database storage
    global.notificationSettings = settings

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings
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
  // Return stored settings or defaults
  return global.notificationSettings || {
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    enableKYCApprovalSMS: false,
    enableKYCRejectionSMS: true,
    enableKYCUnderReviewSMS: false,
    enableTransactionSMS: false,
    smsOnlyForCritical: true,
    emailTemplate: 'default',
    smsTemplate: 'default'
  }
}
