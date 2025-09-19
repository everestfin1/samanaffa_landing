import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { id } = params
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
