import { NextRequest, NextResponse } from 'next/server'
import { count, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { transactionIntents, userAccounts, users } from '@/lib/db/schema'
import type { TransactionStatus } from '@/lib/types'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const whereClause = status
      ? eq(transactionIntents.status, status.toUpperCase() as TransactionStatus)
      : undefined

    const [rows, totalResult] = await Promise.all([
      db
        .select({
          id: transactionIntents.id,
          referenceNumber: transactionIntents.referenceNumber,
          intentType: transactionIntents.intentType,
          amount: transactionIntents.amount,
          paymentMethod: transactionIntents.paymentMethod,
          investmentTranche: transactionIntents.investmentTranche,
          investmentTerm: transactionIntents.investmentTerm,
          userNotes: transactionIntents.userNotes,
          adminNotes: transactionIntents.adminNotes,
          status: transactionIntents.status,
          createdAt: transactionIntents.createdAt,
          updatedAt: transactionIntents.updatedAt,
          userId: users.id,
          userFirstName: users.firstName,
          userLastName: users.lastName,
          userEmail: users.email,
          userPhone: users.phone,
          accountNumber: userAccounts.accountNumber,
          accountType: userAccounts.accountType,
        })
        .from(transactionIntents)
        .innerJoin(users, eq(transactionIntents.userId, users.id))
        .innerJoin(userAccounts, eq(transactionIntents.accountId, userAccounts.id))
        .where(whereClause)
        .orderBy(desc(transactionIntents.createdAt))
        .limit(limit)
        .offset(skip),
      db
        .select({ total: count() })
        .from(transactionIntents)
        .where(whereClause),
    ])

    const total = Number(totalResult[0]?.total ?? 0)

    return NextResponse.json({
      success: true,
      transactionIntents: rows.map((intent) => ({
        id: intent.id,
        referenceNumber: intent.referenceNumber,
        user: {
          id: intent.userId,
          name: `${intent.userFirstName} ${intent.userLastName}`,
          email: intent.userEmail,
          phone: intent.userPhone,
        },
        account: {
          accountNumber: intent.accountNumber,
          accountType: intent.accountType,
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
      },
    })
  } catch (error) {
    console.error('Error fetching transaction intents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
