import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { and, count, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { transactionIntents, userAccounts, users } from '@/lib/db/schema'
import { generateReferenceNumber } from '@/lib/utils'
import { sendTransactionIntentEmail, sendAdminNotificationEmail } from '@/lib/notifications'
import { checkTransactionRateLimit } from '@/lib/rate-limit'
import { sanitizeText, validateAmount } from '@/lib/sanitization'

function respondError(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
    },
    { status },
  )
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token?.sub) {
      return respondError('unauthorized', 'Unauthorized', 401)
    }

    const userId = token.sub

    const {
      accountId: rawAccountId,
      accountType,
      intentType,
      amount,
      paymentMethod,
      investmentTranche,
      investmentTerm,
      userNotes,
      referenceNumber: providedReferenceNumber,
      providerTransactionId,
    } = await request.json()

    const rateLimit = checkTransactionRateLimit(request, userId)

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: rateLimit.blocked
              ? `Trop de demandes de transaction. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
              : 'Trop de demandes de transaction. Veuillez réessayer plus tard.',
            rateLimit: {
              remaining: rateLimit.remaining,
              resetTime: rateLimit.resetTime,
              blocked: rateLimit.blocked,
            },
          },
        { status: 429 },
      )
    }

    const accountId =
      rawAccountId &&
      rawAccountId !== 'null' &&
      rawAccountId !== 'undefined' &&
      rawAccountId.trim() !== ''
        ? rawAccountId
        : null

    const normalizedAccountType = (accountType ?? '').toString().toLowerCase()
    const normalizedIntentType = (intentType ?? '').toString().toLowerCase()

    console.log('[Transaction Intent] Request params:', {
      userId,
      accountId,
      rawAccountId,
      accountType,
      normalizedAccountType,
      intentType,
      normalizedIntentType,
      amount,
    })

    if (!validateAmount(amount)) {
      return respondError('invalid_amount', 'Invalid amount provided', 400)
    }

    const sanitizedUserNotes = userNotes ? sanitizeText(userNotes) : null
    sanitizeText(normalizedAccountType)
    sanitizeText(normalizedIntentType)

    if (providerTransactionId && typeof providerTransactionId !== 'string') {
      return respondError(
        'invalid_provider_transaction_id',
        'Invalid provider transaction identifier',
        400,
      )
    }

    if (!['sama_naffa', 'ape_investment', 'ape_togo_investment'].includes(normalizedAccountType)) {
      return respondError('invalid_account_type', 'Invalid account type', 400)
    }

    if (!['deposit', 'investment', 'withdrawal'].includes(normalizedIntentType)) {
      return respondError('invalid_intent_type', 'Invalid intent type', 400)
    }

    const isProduction =
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_APP_ENV !== 'development' &&
      process.env.NEXT_PUBLIC_APP_ENV !== 'test'

    if (
      isProduction &&
      (normalizedIntentType === 'deposit' || normalizedIntentType === 'withdrawal')
    ) {
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount)

      if (numericAmount < 1000) {
        return respondError(
          'invalid_amount',
          `Le montant minimum pour un ${normalizedIntentType === 'deposit' ? 'dépôt' : 'retrait'} est de 1000 FCFA`,
          400,
        )
      }

      if (numericAmount % 1000 !== 0) {
        return respondError(
          'invalid_amount',
          `Les ${normalizedIntentType === 'deposit' ? 'dépôts' : 'retraits'} doivent être des multiples de 1000 FCFA`,
          400,
        )
      }
    }

    if (normalizedAccountType === 'ape_investment' && normalizedIntentType === 'investment') {
      if (!investmentTranche || !['A', 'B', 'C', 'D'].includes(investmentTranche)) {
        return respondError('invalid_investment_tranche', 'Invalid investment tranche', 400)
      }
      if (!investmentTerm || ![3, 5, 7, 10].includes(investmentTerm)) {
        return respondError('invalid_investment_term', 'Invalid investment term', 400)
      }
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (!user) {
      return respondError('user_not_found', 'User not found', 404)
    }

    const requiresKyc = normalizedIntentType === 'withdrawal'

    if (requiresKyc && user.kycStatus !== 'APPROVED') {
      return NextResponse.json(
        {
          success: false,
          error:
            "Vérification d'identité (KYC) requise pour effectuer des retraits. Veuillez attendre la validation de vos documents.",
          code: 'kyc_required',
          kycStatus: user.kycStatus,
        },
        { status: 403 },
      )
    }

    const accountConditions = [
      eq(userAccounts.userId, userId),
      eq(
        userAccounts.accountType,
        normalizedAccountType.toUpperCase() as 'SAMA_NAFFA' | 'APE_INVESTMENT',
      ),
    ]
    if (accountId) {
      accountConditions.push(eq(userAccounts.id, accountId))
    }

    const userAccountsList = await db
      .select()
      .from(userAccounts)
      .where(and(...accountConditions))

    console.log('[Transaction Intent] User accounts found:', {
      accountCount: userAccountsList.length,
      accounts: userAccountsList.map((a) => ({ id: a.id, type: a.accountType })),
      requestedAccountId: accountId,
    })

    if (!userAccountsList.length) {
      return respondError(
        'account_not_found',
        `Account not found for type ${normalizedAccountType.toUpperCase()}`,
        404,
      )
    }

    const account = userAccountsList[0]

    console.log('[Transaction Intent] Selected account:', {
      accountId: account.id,
      accountType: account.accountType,
      requestedAccountId: accountId,
      idsMatch: account.id === accountId,
    })

    if (accountId && account.id !== accountId) {
      console.error('[Transaction Intent] Account ID mismatch!', {
        foundAccountId: account.id,
        requestedAccountId: accountId,
        accountsAvailable: userAccountsList.map((a) => a.id),
      })
      return respondError('account_mismatch', 'Selected account not found or does not match type', 400)
    }

    const now = new Date()

    if (account.lockedUntil && account.lockedUntil > now && normalizedIntentType === 'withdrawal') {
      return NextResponse.json(
        {
          success: false,
          error: "Ce compte est bloqué jusqu'à la fin de sa période de maturation.",
          code: 'account_locked',
          lockedUntil: account.lockedUntil,
        },
        { status: 403 },
      )
    }

    const createdAt = new Date()
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount)

    const referenceNumber =
      typeof providedReferenceNumber === 'string' && providedReferenceNumber.trim().length > 0
        ? providedReferenceNumber.trim()
        : generateReferenceNumber(
            normalizedAccountType as 'sama_naffa' | 'ape_investment' | 'ape_togo_investment',
            normalizedIntentType as 'deposit' | 'investment' | 'withdrawal',
            userId,
            createdAt,
          )

    const [existingIntent] = await db
      .select()
      .from(transactionIntents)
      .where(
        and(
          eq(transactionIntents.referenceNumber, referenceNumber),
          eq(transactionIntents.userId, userId),
          eq(transactionIntents.status, 'PENDING'),
        ),
      )
      .limit(1)

    if (existingIntent) {
      const [transactionIntent] = await db
        .update(transactionIntents)
        .set({
          paymentMethod: paymentMethod || existingIntent.paymentMethod,
          providerTransactionId: providerTransactionId || existingIntent.providerTransactionId,
          userNotes: sanitizedUserNotes ?? existingIntent.userNotes,
        })
        .where(eq(transactionIntents.id, existingIntent.id))
        .returning()

      if (!transactionIntent) {
        return respondError('internal_error', 'Failed to update transaction intent', 500)
      }

      return NextResponse.json({
        success: true,
        message: 'Transaction intent ready for payment',
        transactionIntent: {
          id: transactionIntent.id,
          referenceNumber: transactionIntent.referenceNumber,
          amount: transactionIntent.amount,
          status: transactionIntent.status,
          createdAt: transactionIntent.createdAt,
          providerTransactionId: transactionIntent.providerTransactionId,
        },
        transactionId: transactionIntent.id,
        providerTransactionId: transactionIntent.providerTransactionId,
      })
    }

    const [transactionIntent] = await db
      .insert(transactionIntents)
      .values({
        userId,
        accountId: account.id,
        accountType: normalizedAccountType.toUpperCase() as 'SAMA_NAFFA' | 'APE_INVESTMENT',
        intentType: normalizedIntentType.toUpperCase() as 'DEPOSIT' | 'INVESTMENT' | 'WITHDRAWAL',
        amount: numericAmount.toFixed(2),
        paymentMethod,
        investmentTranche,
        investmentTerm,
        userNotes,
        referenceNumber,
        providerTransactionId: providerTransactionId || null,
      })
      .returning()

    if (!transactionIntent) {
      return respondError('internal_error', 'Failed to create transaction intent', 500)
    }

    await sendTransactionIntentEmail(user.email, `${user.firstName} ${user.lastName}`, {
      type: normalizedIntentType as 'deposit' | 'investment' | 'withdrawal',
      amount: Number(transactionIntent.amount),
      paymentMethod,
      referenceNumber,
      accountType: normalizedAccountType as 'sama_naffa' | 'ape_investment' | 'ape_togo_investment',
      investmentTranche,
      investmentTerm,
      userNotes,
    })

    await sendAdminNotificationEmail(process.env.ADMIN_EMAIL || 'admin@samanaffa.com', {
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone,
      type: normalizedIntentType as 'deposit' | 'investment' | 'withdrawal',
      amount: Number(transactionIntent.amount),
      paymentMethod,
      referenceNumber,
      accountType: normalizedAccountType as 'sama_naffa' | 'ape_investment' | 'ape_togo_investment',
      investmentTranche,
      investmentTerm,
      userNotes,
    })

    return NextResponse.json({
      success: true,
      message: 'Transaction intent created successfully',
      transactionIntent: {
        id: transactionIntent.id,
        referenceNumber: transactionIntent.referenceNumber,
        amount: transactionIntent.amount,
        status: transactionIntent.status,
        createdAt: transactionIntent.createdAt,
        providerTransactionId: transactionIntent.providerTransactionId,
      },
      transactionId: transactionIntent.id,
      providerTransactionId: transactionIntent.providerTransactionId,
    })
  } catch (error) {
    console.error('Error creating transaction intent:', error)
    return respondError('internal_error', 'Internal server error', 500)
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = token.sub
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const accountType = searchParams.get('accountType')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const conditions = [eq(transactionIntents.userId, userId)]
    if (accountId) {
      conditions.push(eq(transactionIntents.accountId, accountId))
    }
    if (accountType) {
      conditions.push(
        eq(
          transactionIntents.accountType,
          accountType.toUpperCase() as 'SAMA_NAFFA' | 'APE_INVESTMENT',
        ),
      )
    }
    const whereClause = and(...conditions)

    const [countRow, intents] = await Promise.all([
      db.select({ total: count() }).from(transactionIntents).where(whereClause),
      db
        .select()
        .from(transactionIntents)
        .where(whereClause)
        .orderBy(desc(transactionIntents.createdAt))
        .limit(limit)
        .offset(offset),
    ])

    const totalCount = countRow[0]?.total ?? 0

    const accountIds = [...new Set(intents.map((i) => i.accountId))]
    const accounts =
      accountIds.length > 0
        ? await db
            .select()
            .from(userAccounts)
            .where(inArray(userAccounts.id, accountIds))
        : []
    const accountMap = new Map(accounts.map((a) => [a.id, a]))

    const transactionIntentsWithAccount = intents.map((intent) => ({
      ...intent,
      account: accountMap.get(intent.accountId) ?? null,
    }))

    return NextResponse.json({
      success: true,
      transactionIntents: transactionIntentsWithAccount,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('Error fetching transaction intents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
