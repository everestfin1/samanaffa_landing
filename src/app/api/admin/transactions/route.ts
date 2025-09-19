import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = status ? { status: status.toUpperCase() as any } : {}

    const [transactionIntents, total] = await Promise.all([
      prisma.transactionIntent.findMany({
        where,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transactionIntent.count({ where })
    ])

    return NextResponse.json({
      success: true,
      transactionIntents: transactionIntents.map(intent => ({
        id: intent.id,
        referenceNumber: intent.referenceNumber,
        user: {
          id: intent.user.id,
          name: `${intent.user.firstName} ${intent.user.lastName}`,
          email: intent.user.email,
          phone: intent.user.phone,
        },
        account: {
          accountNumber: intent.account.accountNumber,
          accountType: intent.account.accountType,
        },
        intentType: intent.intentType,
        amount: intent.amount,
        paymentMethod: intent.paymentMethod,
        investmentTranche: intent.investmentTranche,
        investmentTerm: intent.investmentTerm,
        userNotes: intent.userNotes,
        adminNotes: intent.adminNotes,
        status: intent.status,
        createdAt: intent.createdAt,
        updatedAt: intent.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Error fetching transaction intents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
