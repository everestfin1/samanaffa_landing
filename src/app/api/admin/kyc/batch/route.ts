import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments, users } from '@/lib/db/schema'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { KycStatus, VerificationStatus } from '@/lib/types'

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
    const result = await db.transaction(async (tx) => {
      const updatedDocuments: Array<{
        doc: typeof kycDocuments.$inferSelect
        user: {
          id: string
          firstName: string
          lastName: string
          email: string
          phone: string
          kycStatus: KycStatus
        }
      }> = []

      for (const update of updates) {
        const [updatedDocument] = await tx
          .update(kycDocuments)
          .set({
            verificationStatus: update.verificationStatus.toUpperCase() as VerificationStatus,
            adminNotes: update.adminNotes,
          })
          .where(eq(kycDocuments.id, update.documentId))
          .returning()

        if (!updatedDocument) {
          throw new Error(`KYC document not found: ${update.documentId}`)
        }

        const [docUser] = await tx
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

        if (!docUser) {
          throw new Error(`User not found for document: ${update.documentId}`)
        }

        updatedDocuments.push({ doc: updatedDocument, user: docUser })
      }

      // If userId is provided, check and update user KYC status
      let userKycStatusUpdated = false
      let newUserKycStatus: KycStatus | null = null

      if (userId) {
        const allUserDocuments = await tx
          .select()
          .from(kycDocuments)
          .where(eq(kycDocuments.userId, userId))

        const pendingDocs = allUserDocuments.filter((doc) => doc.verificationStatus === 'PENDING')
        const approvedDocs = allUserDocuments.filter((doc) => doc.verificationStatus === 'APPROVED')
        const rejectedDocs = allUserDocuments.filter((doc) => doc.verificationStatus === 'REJECTED')

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

        const [currentUser] = await tx
          .select({ kycStatus: users.kycStatus })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)

        if (currentUser && currentUser.kycStatus !== newUserKycStatus) {
          await tx
            .update(users)
            .set({ kycStatus: newUserKycStatus })
            .where(eq(users.id, userId))
          userKycStatusUpdated = true
        }
      }

      return {
        updatedDocuments,
        userKycStatusUpdated,
        newUserKycStatus,
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updates.length} KYC documents`,
      data: {
        updatedDocuments: result.updatedDocuments.map(({ doc, user: docUser }) => ({
          id: doc.id,
          documentType: doc.documentType,
          fileName: doc.fileName,
          fileUrl: doc.fileUrl,
          uploadDate: doc.uploadDate,
          verificationStatus: doc.verificationStatus,
          adminNotes: doc.adminNotes,
          user: {
            id: docUser.id,
            name: `${docUser.firstName} ${docUser.lastName}`,
            email: docUser.email,
            phone: docUser.phone,
            kycStatus: result.userKycStatusUpdated && result.newUserKycStatus
              ? result.newUserKycStatus
              : docUser.kycStatus,
          },
        })),
        userKycStatusUpdated: result.userKycStatusUpdated,
        newUserKycStatus: result.newUserKycStatus,
      },
    })

  } catch (error) {
    console.error('Error performing batch KYC document update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
