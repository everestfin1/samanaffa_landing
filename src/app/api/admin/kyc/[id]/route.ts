import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'

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

    // If document is approved, update user's KYC status
    if (verificationStatus.toUpperCase() === 'APPROVED') {
      await prisma.user.update({
        where: { id: updatedDocument.userId },
        data: { kycStatus: 'APPROVED' }
      })
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
