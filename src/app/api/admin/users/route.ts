import { NextRequest, NextResponse } from 'next/server'
import { count, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { kycDocuments, transactionIntents, userAccounts, users } from '@/lib/db/schema'
import type { KycStatus } from '@/lib/types'
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

    const whereClause = kycStatus
      ? eq(users.kycStatus, kycStatus.toUpperCase() as KycStatus)
      : undefined

    const [userRows, totalResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(skip),
      db
        .select({ total: count() })
        .from(users)
        .where(whereClause),
    ])

    const total = Number(totalResult[0]?.total ?? 0)
    const userIds = userRows.map((u) => u.id)

    const [accounts, kycDocs, txCounts, kycCounts] = userIds.length > 0
      ? await Promise.all([
          db
            .select()
            .from(userAccounts)
            .where(inArray(userAccounts.userId, userIds)),
          db
            .select()
            .from(kycDocuments)
            .where(inArray(kycDocuments.userId, userIds))
            .orderBy(desc(kycDocuments.uploadDate)),
          db
            .select({
              userId: transactionIntents.userId,
              total: count(),
            })
            .from(transactionIntents)
            .where(inArray(transactionIntents.userId, userIds))
            .groupBy(transactionIntents.userId),
          db
            .select({
              userId: kycDocuments.userId,
              total: count(),
            })
            .from(kycDocuments)
            .where(inArray(kycDocuments.userId, userIds))
            .groupBy(kycDocuments.userId),
        ])
      : [[], [], [], []]

    const accountsByUser = new Map<string, typeof accounts>()
    for (const account of accounts) {
      const list = accountsByUser.get(account.userId) ?? []
      list.push(account)
      accountsByUser.set(account.userId, list)
    }

    const latestKycByUser = new Map<string, (typeof kycDocs)[number]>()
    for (const doc of kycDocs) {
      if (!latestKycByUser.has(doc.userId)) {
        latestKycByUser.set(doc.userId, doc)
      }
    }

    const txCountByUser = new Map(txCounts.map((r) => [r.userId, Number(r.total)]))
    const kycCountByUser = new Map(kycCounts.map((r) => [r.userId, Number(r.total)]))

    return NextResponse.json({
      success: true,
      users: userRows.map((u) => ({
        id: u.id,
        email: u.email,
        phone: u.phone,
        firstName: u.firstName,
        lastName: u.lastName,
        dateOfBirth: u.dateOfBirth,
        nationality: u.nationality,
        city: u.city,
        preferredLanguage: u.preferredLanguage,
        emailVerified: u.emailVerified,
        phoneVerified: u.phoneVerified,
        kycStatus: u.kycStatus,
        createdAt: u.createdAt,
        accounts: (accountsByUser.get(u.id) ?? []).map((account) => ({
          id: account.id,
          accountType: account.accountType,
          accountNumber: account.accountNumber,
          balance: account.balance,
          status: account.status,
        })),
        latestKycDocument: latestKycByUser.get(u.id) ?? null,
        stats: {
          totalTransactions: txCountByUser.get(u.id) ?? 0,
          totalKycDocuments: kycCountByUser.get(u.id) ?? 0,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
