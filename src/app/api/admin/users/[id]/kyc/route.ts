import { NextRequest, NextResponse } from 'next/server'
import { count, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments, transactionIntents, userAccounts, users } from '@/lib/db/schema'
import { NotificationType, NotificationPriority, KycStatus } from '@/lib/types'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications'
import { getServerSideNotificationSettings, shouldSendKYCSMS, shouldSendKYCEmail } from '@/lib/notification-settings'
import { createUserNotification } from '@/lib/user-notifications'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { id } = await params
    const { kycStatus, adminNotes } = await request.json()

    if (!kycStatus) {
      return NextResponse.json(
        { error: 'KYC status is required' },
        { status: 400 }
      )
    }

    // Validate KYC status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']
    if (!validStatuses.includes(kycStatus.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid KYC status' },
        { status: 400 }
      )
    }

    const normalizedStatus = kycStatus.toUpperCase() as KycStatus

    const [updatedUser] = await db
      .update(users)
      .set({
        kycStatus: normalizedStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const [accounts, kycDocs, txCountResult, kycCountResult] = await Promise.all([
      db.select().from(userAccounts).where(eq(userAccounts.userId, id)),
      db
        .select()
        .from(kycDocuments)
        .where(eq(kycDocuments.userId, id))
        .orderBy(desc(kycDocuments.uploadDate)),
      db
        .select({ total: count() })
        .from(transactionIntents)
        .where(eq(transactionIntents.userId, id)),
      db
        .select({ total: count() })
        .from(kycDocuments)
        .where(eq(kycDocuments.userId, id)),
    ])

    // Create in-app notification
    let title = ''
    let message = ''
    let notificationType: NotificationType = 'KYC_STATUS'
    let priority: NotificationPriority = 'NORMAL'

    switch (normalizedStatus) {
      case 'APPROVED':
        title = 'KYC Approuvé'
        message = 'Félicitations ! Votre dossier KYC a été approuvé avec succès.'
        notificationType = 'SUCCESS'
        priority = 'HIGH'
        break
      case 'REJECTED':
        title = 'KYC Rejeté'
        message = 'Votre dossier KYC nécessite des corrections. Veuillez consulter les détails.'
        notificationType = 'ERROR'
        priority = 'HIGH'
        break
      case 'UNDER_REVIEW':
        title = 'KYC En Révision'
        message = 'Votre dossier KYC est actuellement en cours de révision.'
        notificationType = 'WARNING'
        priority = 'NORMAL'
        break
    }

    if (title) {
      try {
        await createUserNotification(id, {
          title,
          message,
          type: notificationType,
          priority,
          metadata: {
            kycStatus: normalizedStatus,
            adminNotes,
            adminId: user.id,
            adminEmail: user.email,
          },
        })
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError)
      }
    }

    // Get notification settings
    const notificationSettings = getServerSideNotificationSettings()

    // Send email notification if enabled
    if (
      normalizedStatus !== 'PENDING' &&
      shouldSendKYCEmail(normalizedStatus, notificationSettings)
    ) {
      try {
        await sendKYCStatusEmail(
          updatedUser.email,
          `${updatedUser.firstName} ${updatedUser.lastName}`,
          normalizedStatus
        )
      } catch (emailError) {
        console.error('Error sending KYC status email:', emailError)
      }
    }

    // Send SMS notification if enabled and configured
    if (
      normalizedStatus !== 'PENDING' &&
      shouldSendKYCSMS(normalizedStatus, notificationSettings)
    ) {
      try {
        await sendKYCStatusSMS(updatedUser.phone, normalizedStatus)
      } catch (smsError) {
        console.error('Error sending KYC status SMS:', smsError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'KYC status updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        kycStatus: updatedUser.kycStatus,
        accounts,
        kycDocuments: kycDocs,
        stats: {
          totalTransactions: Number(txCountResult[0]?.total ?? 0),
          totalKycDocuments: Number(kycCountResult[0]?.total ?? 0),
        },
      },
    })
  } catch (error) {
    console.error('Error updating KYC status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
