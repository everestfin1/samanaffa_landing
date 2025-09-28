import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationPriority } from '@prisma/client'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications'
import { getServerSideNotificationSettings, shouldSendKYCSMS, shouldSendKYCEmail } from '@/lib/notification-settings'

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

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        kycStatus: kycStatus.toUpperCase(),
        updatedAt: new Date(),
      },
      include: {
        accounts: true,
        kycDocuments: {
          orderBy: { uploadDate: 'desc' }
        },
        _count: {
          select: {
            transactionIntents: true,
            kycDocuments: true,
          }
        }
      }
    })

    // Create in-app notification
    let title = ''
    let message = ''
    let notificationType: NotificationType = NotificationType.KYC_STATUS
    let priority: NotificationPriority = NotificationPriority.NORMAL

    switch (kycStatus.toUpperCase()) {
      case 'APPROVED':
        title = 'KYC Approuvé'
        message = 'Félicitations ! Votre dossier KYC a été approuvé avec succès.'
        notificationType = NotificationType.SUCCESS
        priority = NotificationPriority.HIGH
        break
      case 'REJECTED':
        title = 'KYC Rejeté'
        message = 'Votre dossier KYC nécessite des corrections. Veuillez consulter les détails.'
        notificationType = NotificationType.ERROR
        priority = NotificationPriority.HIGH
        break
      case 'UNDER_REVIEW':
        title = 'KYC En Révision'
        message = 'Votre dossier KYC est actuellement en cours de révision.'
        notificationType = NotificationType.WARNING
        priority = NotificationPriority.NORMAL
        break
    }

    // Create in-app notification
    try {
      await prisma.notification.create({
        data: {
          userId: id,
          title,
          message,
          type: notificationType,
          priority,
          metadata: JSON.stringify({
            kycStatus: kycStatus.toUpperCase(),
            adminNotes,
            adminId: user.id,
            adminEmail: user.email
          })
        }
      })
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError)
    }

    // Get notification settings
    const notificationSettings = getServerSideNotificationSettings()

    // Send email notification if enabled
    if (shouldSendKYCEmail(kycStatus.toUpperCase() as any, notificationSettings)) {
      try {
        await sendKYCStatusEmail(
          updatedUser.email,
          `${updatedUser.firstName} ${updatedUser.lastName}`,
          kycStatus.toUpperCase() as any
        )
      } catch (emailError) {
        console.error('Error sending KYC status email:', emailError)
      }
    }

    // Send SMS notification if enabled and configured
    if (shouldSendKYCSMS(kycStatus.toUpperCase() as any, notificationSettings)) {
      try {
        await sendKYCStatusSMS(updatedUser.phone, kycStatus.toUpperCase() as any)
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
        accounts: updatedUser.accounts,
        kycDocuments: updatedUser.kycDocuments,
        stats: {
          totalTransactions: updatedUser._count.transactionIntents,
          totalKycDocuments: updatedUser._count.kycDocuments,
        }
      }
    })
  } catch (error) {
    console.error('Error updating KYC status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
