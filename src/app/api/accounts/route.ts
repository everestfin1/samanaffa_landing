import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addMonths, generateAccountNumber } from '@/lib/utils'
import { getNaffaProductById } from '@/lib/naffa-products'

function serializeAccount(account: any) {
  const now = new Date()
  const lockedUntil = account.lockedUntil ? new Date(account.lockedUntil) : null
  const isLocked = lockedUntil ? lockedUntil > now : false

  return {
    id: account.id,
    accountType: account.accountType,
    accountNumber: account.accountNumber,
    productCode: account.productCode,
    productName: account.productName,
    interestRate:
      typeof account.interestRate === 'number'
        ? account.interestRate
        : account.interestRate
        ? Number(account.interestRate)
        : null,
    lockPeriodMonths: account.lockPeriodMonths,
    lockedUntil,
    isLocked,
    allowAdditionalDeposits: account.allowAdditionalDeposits ?? true,
    metadata: account.metadata ?? {},
    balance:
      typeof account.balance === 'number'
        ? account.balance
        : account.balance
        ? Number(account.balance)
        : 0,
    status: account.status,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    recentTransactions: (account.transactionIntents || []).map((intent: any) => ({
      id: intent.id,
      intentType: intent.intentType,
      amount:
        typeof intent.amount === 'number'
          ? intent.amount
          : intent.amount
          ? Number(intent.amount)
          : 0,
      status: intent.status,
      referenceNumber: intent.referenceNumber,
      createdAt: intent.createdAt
    }))
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '20', 10))
    )
    const skip = (page - 1) * limit
    const accountTypeFilter = searchParams.get('accountType')

    const whereClause: Prisma.UserAccountWhereInput = {
      userId: (session?.user as any).id
    }

    if (accountTypeFilter) {
      whereClause.accountType = accountTypeFilter.toUpperCase() as any
    }

    const [accounts, total] = await Promise.all([
      prisma.userAccount.findMany({
        where: whereClause,
        include: {
          transactionIntents: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.userAccount.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      accounts: accounts.map(serializeAccount),
      total,
      page,
      limit
    })
  } catch (error) {
    console.error('Error fetching user accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
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
      metadata
    } = body ?? {}

    const normalizedAccountType = (accountType || 'SAMA_NAFFA').toString().toUpperCase()
    if (normalizedAccountType !== 'SAMA_NAFFA') {
      return NextResponse.json(
        { error: 'Only Sama Naffa accounts can be created via this endpoint.' },
        { status: 400 }
      )
    }

    const product = getNaffaProductById(productId)
    const effectiveInterestRate =
      typeof interestRate === 'number' ? interestRate : product.interestRate
    const effectiveLockPeriodMonths =
      typeof lockPeriodMonths === 'number'
        ? lockPeriodMonths
        : product.lockPeriodMonths
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
    const metadataInput = mergedMetadata
      ? (mergedMetadata as Prisma.InputJsonValue)
      : undefined

    const account = await prisma.userAccount.create({
      data: {
        userId: (session?.user as any).id,
        accountType: normalizedAccountType as any,
        accountNumber: generateAccountNumber('SN'),
        productCode: effectiveProductCode,
        productName: effectiveProductName,
        interestRate: effectiveInterestRate
          ? new Prisma.Decimal(effectiveInterestRate.toFixed(2))
          : null,
        lockPeriodMonths: effectiveLockPeriodMonths ?? null,
        lockedUntil: effectiveLockedUntil,
        allowAdditionalDeposits: effectiveAllowDeposits,
        metadata: metadataInput,
        status: 'ACTIVE'
      },
      include: {
        transactionIntents: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    return NextResponse.json({
      success: true,
      account: serializeAccount(account)
    })
  } catch (error) {
    console.error('Error creating user account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
