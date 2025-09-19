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
    const { status, adminNotes } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED']
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedIntent = await prisma.transactionIntent.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        adminNotes,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        account: {
          select: {
            accountNumber: true,
            accountType: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Transaction intent updated successfully',
      transactionIntent: {
        id: updatedIntent.id,
        referenceNumber: updatedIntent.referenceNumber,
        user: {
          id: updatedIntent.user.id,
          name: `${updatedIntent.user.firstName} ${updatedIntent.user.lastName}`,
          email: updatedIntent.user.email,
          phone: updatedIntent.user.phone,
        },
        account: {
          accountNumber: updatedIntent.account.accountNumber,
          accountType: updatedIntent.account.accountType,
        },
        intentType: updatedIntent.intentType,
        amount: updatedIntent.amount,
        paymentMethod: updatedIntent.paymentMethod,
        investmentTranche: updatedIntent.investmentTranche,
        investmentTerm: updatedIntent.investmentTerm,
        userNotes: updatedIntent.userNotes,
        adminNotes: updatedIntent.adminNotes,
        status: updatedIntent.status,
        createdAt: updatedIntent.createdAt,
        updatedAt: updatedIntent.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error updating transaction intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    const transactionIntent = await prisma.transactionIntent.findUnique({
      where: { id },
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
        },
        account: {
          select: {
            accountNumber: true,
            accountType: true,
            balance: true,
          }
        }
      }
    })

    if (!transactionIntent) {
      return NextResponse.json(
        { error: 'Transaction intent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      transactionIntent: {
        id: transactionIntent.id,
        referenceNumber: transactionIntent.referenceNumber,
        user: {
          id: transactionIntent.user.id,
          name: `${transactionIntent.user.firstName} ${transactionIntent.user.lastName}`,
          email: transactionIntent.user.email,
          phone: transactionIntent.user.phone,
          kycStatus: transactionIntent.user.kycStatus,
        },
        account: {
          accountNumber: transactionIntent.account.accountNumber,
          accountType: transactionIntent.account.accountType,
          balance: transactionIntent.account.balance,
        },
        intentType: transactionIntent.intentType,
        amount: transactionIntent.amount,
        paymentMethod: transactionIntent.paymentMethod,
        investmentTranche: transactionIntent.investmentTranche,
        investmentTerm: transactionIntent.investmentTerm,
        userNotes: transactionIntent.userNotes,
        adminNotes: transactionIntent.adminNotes,
        status: transactionIntent.status,
        createdAt: transactionIntent.createdAt,
        updatedAt: transactionIntent.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error fetching transaction intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
