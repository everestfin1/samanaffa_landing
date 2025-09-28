import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { sendKYCStatusEmail, sendKYCStatusSMS } from '@/lib/notifications'
import { getServerSideNotificationSettings, shouldSendKYCSMS, shouldSendKYCEmail } from '@/lib/notification-settings'
import { KycStatus, NotificationPriority, NotificationType } from '@prisma/client'

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
    const { verificationStatus, adminNotes } = await request.json()

    if (!verificationStatus) {
      return NextResponse.json(
        { error: 'Verification status is required' },
        { status: 400 }
      )
    }

    // Validate verification status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']
    if (!validStatuses.includes(verificationStatus.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid verification status' },
        { status: 400 }
      )
    }

    const updatedDocument = await prisma.kycDocument.update({
      where: { id },
      data: {
        verificationStatus: verificationStatus.toUpperCase(),
        adminNotes,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            kycStatus: true,
          }
        }
      }
    })

    // Check if we need to update user's overall KYC status
    const userDocuments = await prisma.kycDocument.findMany({
      where: { userId: updatedDocument.userId },
      select: { verificationStatus: true }
    })

    const approvedDocs = userDocuments.filter(doc => doc.verificationStatus === 'APPROVED').length
    const rejectedDocs = userDocuments.filter(doc => doc.verificationStatus === 'REJECTED').length
    const pendingDocs = userDocuments.filter(doc => doc.verificationStatus === 'PENDING').length

    let newKycStatus = null
    
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
    if (newKycStatus && newKycStatus !== updatedDocument.user.kycStatus) {
      await prisma.user.update({
        where: { id: updatedDocument.userId },
        data: { kycStatus: newKycStatus as KycStatus }
      })

      // Create notification for status change
      let title = ''
      let message = ''
      let notificationType = 'KYC_STATUS'
      let priority = 'NORMAL'

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
      try {
        await prisma.notification.create({
          data: {
            userId: updatedDocument.userId,
            title,
            message,
            type: notificationType as NotificationType,
            priority: priority as NotificationPriority,
            metadata: JSON.stringify({
              kycStatus: newKycStatus,
              documentId: updatedDocument.id,
              documentType: updatedDocument.documentType,
              adminNotes: adminNotes
            })
          }
        })
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError)
      }

      // Get notification settings
      const notificationSettings = getServerSideNotificationSettings()

      // Send email notification if enabled
      if (shouldSendKYCEmail(newKycStatus as any, notificationSettings)) {
        try {
          await sendKYCStatusEmail(
            updatedDocument.user.email,
            `${updatedDocument.user.firstName} ${updatedDocument.user.lastName}`,
            newKycStatus as any
          )
        } catch (emailError) {
          console.error('Error sending KYC status email:', emailError)
        }
      }

      // Send SMS notification if enabled and configured
      if (shouldSendKYCSMS(newKycStatus as any, notificationSettings)) {
        try {
          await sendKYCStatusSMS(updatedDocument.user.phone, newKycStatus as any)
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
          id: updatedDocument.user.id,
          name: `${updatedDocument.user.firstName} ${updatedDocument.user.lastName}`,
          email: updatedDocument.user.email,
          phone: updatedDocument.user.phone,
          kycStatus: updatedDocument.user.kycStatus,
        }
      }
    })
  } catch (error) {
    console.error('Error updating KYC document verification status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
