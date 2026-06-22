import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { and, count, desc, eq, inArray } from 'drizzle-orm'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { transactionIntents, userAccounts } from '@/lib/db/schema'
import type { TransactionIntent, UserAccount } from '@/lib/db/schema'
import { addMonths, generateAccountNumber } from '@/lib/utils'
import { getNaffaProductById } from '@/lib/naffa-products'
import { validateDuree, validateMensualite } from '@/lib/savings-simulation'

function serializeAccount(
  account: UserAccount,
  recentTransactions: TransactionIntent[] = [],
) {
  const now = new Date()
  const lockedUntil = account.lockedUntil ? new Date(account.lockedUntil) : null
  const isLocked = lockedUntil ? lockedUntil > now : false

  return {
    id: account.id,
    accountType: account.accountType,
    accountNumber: account.accountNumber,
    productCode: account.productCode,
    productName: account.productName,
    interestRate: account.interestRate ? Number(account.interestRate) : null,
    lockPeriodMonths: account.lockPeriodMonths,
    lockedUntil,
    isLocked,
    allowAdditionalDeposits: account.allowAdditionalDeposits ?? true,
    metadata: account.metadata ?? {},
    balance: account.balance ? Number(account.balance) : 0,
    status: account.status,
    createdAt: account.createdAt,
    recentTransactions: recentTransactions.map((intent) => ({
      id: intent.id,
      intentType: intent.intentType,
      amount: intent.amount ? Number(intent.amount) : 0,
      status: intent.status,
      referenceNumber: intent.referenceNumber,
      createdAt: intent.createdAt,
    })),
  }
}

async function attachRecentTransactions(accounts: UserAccount[]) {
  if (accounts.length === 0) return accounts.map((a) => serializeAccount(a, []))

  const accountIds = accounts.map((a) => a.id)
  const intents = await db
    .select()
    .from(transactionIntents)
    .where(inArray(transactionIntents.accountId, accountIds))
    .orderBy(desc(transactionIntents.createdAt))

  const byAccount = new Map<string, TransactionIntent[]>()
  for (const intent of intents) {
    const list = byAccount.get(intent.accountId) ?? []
    if (list.length < 5) {
      list.push(intent)
      byAccount.set(intent.accountId, list)
    }
  }

  return accounts.map((account) =>
    serializeAccount(account, byAccount.get(account.id) ?? []),
  )
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const skip = (page - 1) * limit
    const accountTypeFilter = searchParams.get('accountType')

    const conditions = [eq(userAccounts.userId, session.user.id)]
    if (accountTypeFilter) {
      conditions.push(eq(userAccounts.accountType, accountTypeFilter.toUpperCase() as typeof userAccounts.accountType.enumValues[number]))
    }
    const whereClause = and(...conditions)

    const [accounts, countRow] = await Promise.all([
      db
        .select()
        .from(userAccounts)
        .where(whereClause)
        .orderBy(desc(userAccounts.createdAt))
        .limit(limit)
        .offset(skip),
      db.select({ total: count() }).from(userAccounts).where(whereClause),
    ])

    const total = countRow[0]?.total ?? 0
    const serialized = await attachRecentTransactions(accounts)

    return NextResponse.json({
      success: true,
      accounts: serialized,
      total,
      page,
      limit,
    })
  } catch (error) {
    console.error('Error fetching user accounts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const {
      productId,
      accountType = 'SAMA_NAFFA',
      productName,
      productCode,
      interestRate,
      lockPeriodMonths,
      allowAdditionalDeposits,
      metadata,
    } = body ?? {}

    const normalizedAccountType = (accountType || 'SAMA_NAFFA').toString().toUpperCase()
    if (normalizedAccountType !== 'SAMA_NAFFA') {
      return NextResponse.json(
        { error: 'Only Sama Naffa accounts can be created via this endpoint.' },
        { status: 400 },
      )
    }

    const planMonthly =
      metadata && typeof metadata === 'object' && 'monthlyAmount' in metadata
        ? Number((metadata as { monthlyAmount?: unknown }).monthlyAmount)
        : null
    const planDuration =
      metadata && typeof metadata === 'object' && 'durationMonths' in metadata
        ? Number((metadata as { durationMonths?: unknown }).durationMonths)
        : null

    if (planMonthly != null && !Number.isNaN(planMonthly)) {
      const mensualiteError = validateMensualite(planMonthly)
      if (mensualiteError) {
        return NextResponse.json({ error: mensualiteError }, { status: 400 })
      }
    }

    if (planDuration != null && !Number.isNaN(planDuration)) {
      const dureeError = validateDuree(planDuration)
      if (dureeError) {
        return NextResponse.json({ error: dureeError }, { status: 400 })
      }
    }

    const product = getNaffaProductById(productId)
    const effectiveInterestRate =
      typeof interestRate === 'number' ? interestRate : product.interestRate
    const effectiveLockPeriodMonths =
      typeof lockPeriodMonths === 'number' ? lockPeriodMonths : product.lockPeriodMonths
    const effectiveAllowDeposits =
      typeof allowAdditionalDeposits === 'boolean'
        ? allowAdditionalDeposits
        : product.allowAdditionalDeposits
    const effectiveProductName = productName ?? product.name
    const effectiveProductCode = productCode ?? product.productCode
    const effectiveLockedUntil =
      effectiveLockPeriodMonths && effectiveLockPeriodMonths > 0
        ? addMonths(new Date(), effectiveLockPeriodMonths)
        : null
    const mergedMetadata =
      metadata && product.metadata
        ? { ...product.metadata, ...metadata }
        : metadata
          ? metadata
          : product.metadata

    const [account] = await db
      .insert(userAccounts)
      .values({
        userId: session.user.id,
        accountType: 'SAMA_NAFFA',
        accountNumber: generateAccountNumber('SN'),
        productCode: effectiveProductCode,
        productName: effectiveProductName,
        interestRate: effectiveInterestRate ? effectiveInterestRate.toFixed(2) : null,
        lockPeriodMonths: effectiveLockPeriodMonths ?? null,
        lockedUntil: effectiveLockedUntil,
        allowAdditionalDeposits: effectiveAllowDeposits,
        metadata: mergedMetadata ?? undefined,
        status: 'ACTIVE',
      })
      .returning()

    if (!account) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      account: serializeAccount(account, []),
    })
  } catch (error) {
    console.error('Error creating user account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
