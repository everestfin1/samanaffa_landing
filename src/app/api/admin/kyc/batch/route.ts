import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'

interface BatchUpdateRequest {
  updates: {
    documentId: string
    verificationStatus: string
    adminNotes?: string
  }[]
  userId?: string // Optional: if provided, also update user KYC status after batch
}

export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)

  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const { updates, userId }: BatchUpdateRequest = await request.json()

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Updates array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Validate all updates
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']
    for (const update of updates) {
      if (!update.documentId || !update.verificationStatus) {
        return NextResponse.json(
          { error: 'Each update must include documentId and verificationStatus' },
          { status: 400 }
        )
      }

      if (!validStatuses.includes(update.verificationStatus.toUpperCase())) {
        return NextResponse.json(
          { error: `Invalid verification status: ${update.verificationStatus}` },
          { status: 400 }
        )
      }
    }

    // Perform batch update using a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedDocuments = []

      for (const update of updates) {
        const updatedDocument = await tx.kycDocument.update({
          where: { id: update.documentId },
          data: {
            verificationStatus: update.verificationStatus.toUpperCase(),
            adminNotes: update.adminNotes,
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
        updatedDocuments.push(updatedDocument)
      }

      // If userId is provided, check and update user KYC status
      let userKycStatusUpdated = false
      let newUserKycStatus = null

      if (userId) {
        // Fetch all user's KYC documents to determine overall status
        const allUserDocuments = await tx.kycDocument.findMany({
          where: { userId },
        })

        const pendingDocs = allUserDocuments.filter(doc => doc.verificationStatus === 'PENDING')
        const approvedDocs = allUserDocuments.filter(doc => doc.verificationStatus === 'APPROVED')
        const rejectedDocs = allUserDocuments.filter(doc => doc.verificationStatus === 'REJECTED')

        // Determine new user KYC status
        if (approvedDocs.length > 0 && pendingDocs.length === 0 && rejectedDocs.length === 0) {
          newUserKycStatus = 'APPROVED'
        } else if (rejectedDocs.length > 0) {
          newUserKycStatus = 'REJECTED'
        } else if (pendingDocs.length > 0) {
          newUserKycStatus = 'UNDER_REVIEW'
        } else {
          newUserKycStatus = 'PENDING'
        }

        // Update user KYC status if it changed
        const currentUser = await tx.user.findUnique({
          where: { id: userId },
          select: { kycStatus: true }
        })

        if (currentUser && currentUser.kycStatus !== newUserKycStatus) {
          await tx.user.update({
            where: { id: userId },
            data: { kycStatus: newUserKycStatus }
          })
          userKycStatusUpdated = true
        }
      }

      return {
        updatedDocuments,
        userKycStatusUpdated,
        newUserKycStatus
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updates.length} KYC documents`,
      data: {
        updatedDocuments: result.updatedDocuments.map(doc => ({
          id: doc.id,
          documentType: doc.documentType,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          uploadDate: doc.uploadDate,
          verificationStatus: doc.verificationStatus,
          adminNotes: doc.adminNotes,
          user: {
            id: doc.user.id,
            name: `${doc.user.firstName} ${doc.user.lastName}`,
            email: doc.user.email,
            phone: doc.user.phone,
            kycStatus: doc.user.kycStatus,
          }
        })),
        userKycStatusUpdated: result.userKycStatusUpdated,
        newUserKycStatus: result.newUserKycStatus
      }
    })

  } catch (error) {
    console.error('Error performing batch KYC document update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
