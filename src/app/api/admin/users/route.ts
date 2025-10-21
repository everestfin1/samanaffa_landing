import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { searchParams } = new URL(request.url)
    const kycStatus = searchParams.get('kycStatus')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = kycStatus ? { kycStatus: kycStatus.toUpperCase() as any } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          accounts: true,
          kycDocuments: {
            orderBy: { uploadDate: 'desc' },
            take: 1 // Get latest KYC document
          },
          _count: {
            select: {
              transactionIntents: true,
              kycDocuments: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        nationality: user.nationality,
        city: user.city,
        preferredLanguage: user.preferredLanguage,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
        accounts: (user as any).accounts.map((account: any) => ({
          id: account.id,
          accountType: account.accountType,
          accountNumber: account.accountNumber,
          balance: account.balance,
          status: account.status,
        })),
        latestKycDocument: (user as any).kycDocuments[0] || null,
        stats: {
          totalTransactions: (user as any)._count.transactionIntents,
          totalKycDocuments: (user as any)._count.kycDocuments,
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
