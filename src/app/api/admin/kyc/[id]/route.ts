import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments, users } from '@/lib/db/schema'
import { updateOnboardingDepositIntentsForKycStatus } from '@/lib/kyc-deposit-intents'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications'
import { loadNotificationSettings, shouldSendKYCSMS, shouldSendKYCEmail } from '@/lib/notification-settings'
import { KycStatus, NotificationPriority, NotificationType, VerificationStatus } from '@/lib/types'
import { logKYCApproval, logKYCRejection } from '@/lib/audit-logger'
import { createUserNotification } from '@/lib/user-notifications'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const { error, user: adminUser } = await verifyAdminAuth(request)

  if (error || !adminUser) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { id } = await params
    const { verificationStatus, adminNotes } = await request.json()

    if (!verificationStatus) {
      return NextResponse.json(
        { error: 'Verification status is required' },
        { status: 400 }
      )
    }

    // Validate verification status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']
    const normalizedStatus = verificationStatus.toUpperCase()
    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        { error: 'Invalid verification status' },
        { status: 400 }
      )
    }

    const [updatedDocument] = await db
      .update(kycDocuments)
      .set({
        verificationStatus: normalizedStatus as VerificationStatus,
        adminNotes,
      })
      .where(eq(kycDocuments.id, id))
      .returning()

    if (!updatedDocument) {
      return NextResponse.json(
        { error: 'KYC document not found' },
        { status: 404 }
      )
    }

    const [userData] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        kycStatus: users.kycStatus,
      })
      .from(users)
      .where(eq(users.id, updatedDocument.userId))
      .limit(1)

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found for KYC document' },
        { status: 404 }
      )
    }

    // Log KYC action
    if (normalizedStatus === 'APPROVED') {
      await logKYCApproval(
        adminUser.id,
        updatedDocument.userId,
        updatedDocument.id,
        request
      )
    } else if (normalizedStatus === 'REJECTED') {
      await logKYCRejection(
        adminUser.id,
        updatedDocument.userId,
        updatedDocument.id,
        adminNotes || 'No reason provided',
        request
      )
    }

    // Check if we need to update user's overall KYC status
    const userDocuments = await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.userId, updatedDocument.userId))

    const approvedDocs = userDocuments.filter(doc => doc.verificationStatus === 'APPROVED').length
    const rejectedDocs = userDocuments.filter(doc => doc.verificationStatus === 'REJECTED').length
    const pendingDocs = userDocuments.filter(doc => doc.verificationStatus === 'PENDING').length

    let newKycStatus: KycStatus | null = null
    
    // If all documents are approved, approve user KYC
    if (approvedDocs > 0 && pendingDocs === 0 && rejectedDocs === 0) {
      newKycStatus = 'APPROVED'
    }
    // If any documents are rejected, mark user KYC as rejected
    else if (rejectedDocs > 0) {
      newKycStatus = 'REJECTED'
    }
    // If there are still pending documents but some are processed, set to UNDER_REVIEW
    else if (pendingDocs > 0 && (approvedDocs > 0 || rejectedDocs > 0)) {
      newKycStatus = 'UNDER_REVIEW'
    }

    // Update user KYC status if needed
    if (newKycStatus && newKycStatus !== userData.kycStatus) {
      await db
        .update(users)
        .set({ kycStatus: newKycStatus })
        .where(eq(users.id, updatedDocument.userId))

      if (newKycStatus === 'REJECTED' || newKycStatus === 'APPROVED') {
        await updateOnboardingDepositIntentsForKycStatus(
          updatedDocument.userId,
          newKycStatus,
        )
      }

      // Create notification for status change
      let title = ''
      let message = ''
      let notificationType: NotificationType = 'KYC_STATUS'
      let priority: NotificationPriority = 'NORMAL'

      switch (newKycStatus) {
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

      // Create in-app notification
      if (title) {
        try {
          await createUserNotification(updatedDocument.userId, {
            title,
            message,
            type: notificationType,
            priority,
            metadata: {
              kycStatus: newKycStatus,
              documentId: updatedDocument.id,
              documentType: updatedDocument.documentType,
              adminNotes,
            },
          })
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError)
        }
      }

      // Get notification settings
      const notificationSettings = await loadNotificationSettings()

      // Send email notification if enabled
      if (shouldSendKYCEmail(newKycStatus, notificationSettings)) {
        try {
          await sendKYCStatusEmail(
            userData.email,
            `${userData.firstName} ${userData.lastName}`,
            newKycStatus
          )
        } catch (emailError) {
          console.error('Error sending KYC status email:', emailError)
        }
      }

      // Send SMS notification if enabled and configured
      if (shouldSendKYCSMS(newKycStatus, notificationSettings)) {
        try {
          await sendKYCStatusSMS(userData.phone, newKycStatus)
        } catch (smsError) {
          console.error('Error sending KYC status SMS:', smsError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'KYC document verification status updated successfully',
      document: {
        id: updatedDocument.id,
        documentType: updatedDocument.documentType,
        fileName: updatedDocument.fileName,
        fileUrl: updatedDocument.fileUrl,
        uploadDate: updatedDocument.uploadDate,
        verificationStatus: updatedDocument.verificationStatus,
        adminNotes: updatedDocument.adminNotes,
        user: {
          id: userData.id,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone,
          kycStatus: newKycStatus ?? userData.kycStatus,
        },
      },
    })
  } catch (error) {
    console.error('Error updating KYC document verification status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
