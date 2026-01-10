import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
  );
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
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

    // Check rate limiting for transaction creation
    if (userId) {
      const rateLimit = checkTransactionRateLimit(request, userId)
      
      if (!rateLimit.allowed) {
        return NextResponse.json({
          success: false,
          error: rateLimit.blocked 
            ? `Trop de demandes de transaction. Réessayez dans ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
            : 'Trop de demandes de transaction. Veuillez réessayer plus tard.',
          rateLimit: {
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime,
            blocked: rateLimit.blocked
          }
        }, { status: 429 })
      }
    }

    // Normalize accountId - treat empty strings, "null", "undefined" as null
    const accountId = rawAccountId && 
                      rawAccountId !== 'null' && 
                      rawAccountId !== 'undefined' && 
                      rawAccountId.trim() !== '' 
                      ? rawAccountId 
                      : null;

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
      amount
    });

    // Validate and sanitize input
    if (!userId || typeof userId !== 'string') {
      return respondError('invalid_user_id', 'User ID is required and must be a string', 400)
    }

    if (!validateAmount(amount)) {
      return respondError('invalid_amount', 'Invalid amount provided', 400)
    }

    // Sanitize text inputs
    const sanitizedUserNotes = userNotes ? sanitizeText(userNotes) : null
    const sanitizedAccountType = sanitizeText(normalizedAccountType)
    const sanitizedIntentType = sanitizeText(normalizedIntentType)

    if (providerTransactionId && typeof providerTransactionId !== 'string') {
      return respondError('invalid_provider_transaction_id', 'Invalid provider transaction identifier', 400)
    }

    // Validate account type
    if (!['sama_naffa', 'ape_investment', 'ape_togo_investment'].includes(normalizedAccountType)) {
      return respondError('invalid_account_type', 'Invalid account type', 400)
    }

    // Validate intent type
    if (!['deposit', 'investment', 'withdrawal'].includes(normalizedIntentType)) {
      return respondError('invalid_intent_type', 'Invalid intent type', 400)
    }

    // Validate amount for deposits and withdrawals in production
    const isProduction = process.env.NODE_ENV === 'production' && 
                         process.env.NEXT_PUBLIC_APP_ENV !== 'development' && 
                         process.env.NEXT_PUBLIC_APP_ENV !== 'test';
    
    if (isProduction && (normalizedIntentType === 'deposit' || normalizedIntentType === 'withdrawal')) {
      const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
      
      if (numericAmount < 1000) {
        return respondError(
          'invalid_amount', 
          `Le montant minimum pour un ${normalizedIntentType === 'deposit' ? 'dépôt' : 'retrait'} est de 1000 FCFA`, 
          400
        )
      }
      
      if (numericAmount % 1000 !== 0) {
        return respondError(
          'invalid_amount', 
          `Les ${normalizedIntentType === 'deposit' ? 'dépôts' : 'retraits'} doivent être des multiples de 1000 FCFA`, 
          400
        )
      }
    }

    // For APE investments, validate tranche and term
    if (normalizedAccountType === 'ape_investment' && normalizedIntentType === 'investment') {
      if (!investmentTranche || !['A', 'B', 'C', 'D'].includes(investmentTranche)) {
        return respondError('invalid_investment_tranche', 'Invalid investment tranche', 400)
      }
      if (!investmentTerm || ![3, 5, 7, 10].includes(investmentTerm)) {
        return respondError('invalid_investment_term', 'Invalid investment term', 400)
      }
    }

    // Get user and their account
    const accountQuery = {
      accountType: normalizedAccountType.toUpperCase(),
      ...(accountId && { id: accountId })
    };
    
    console.log('[Transaction Intent] Querying accounts with filter:', accountQuery);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: accountQuery
        }
      }
    })

    if (!user) {
      return respondError('user_not_found', 'User not found', 404)
    }

    // Check KYC status - allow deposits and investments without KYC, but require for withdrawals
    const requiresKyc = normalizedIntentType === 'withdrawal';

    if (requiresKyc && user.kycStatus !== 'APPROVED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Vérification d\'identité (KYC) requise pour effectuer des retraits. Veuillez attendre la validation de vos documents.',
          code: 'kyc_required',
          kycStatus: user.kycStatus,
        },
        { status: 403 },
      )
    }

    console.log('[Transaction Intent] User accounts found:', {
      accountCount: user.accounts.length,
      accounts: user.accounts.map((a: any) => ({ id: a.id, type: a.accountType })),
      requestedAccountId: accountId
    });

    if (!user.accounts.length) {
      return respondError('account_not_found', `Account not found for type ${normalizedAccountType.toUpperCase()}`, 404)
    }

    const account = user.accounts[0]
    
    console.log('[Transaction Intent] Selected account:', {
      accountId: account.id,
      accountType: account.accountType,
      requestedAccountId: accountId,
      idsMatch: account.id === accountId
    });
    
    if (accountId && account.id !== accountId) {
      console.error('[Transaction Intent] Account ID mismatch!', {
        foundAccountId: account.id,
        requestedAccountId: accountId,
        accountsAvailable: user.accounts.map((a: any) => a.id)
      });
      return respondError('account_mismatch', 'Selected account not found or does not match type', 400)
    }
    const now = new Date()

    if (account.lockedUntil && account.lockedUntil > now && normalizedIntentType === 'withdrawal') {
      return NextResponse.json(
        {
          success: false,
          error: 'Ce compte est bloqué jusqu\'à la fin de sa période de maturation.',
          code: 'account_locked',
          lockedUntil: account.lockedUntil,
        },
        { status: 403 },
      )
    }

    const createdAt = new Date()

    // Generate reference number
    const referenceNumber =
      typeof providedReferenceNumber === 'string' && providedReferenceNumber.trim().length > 0
        ? providedReferenceNumber.trim()
        : generateReferenceNumber(
            normalizedAccountType as 'sama_naffa' | 'ape_investment' | 'ape_togo_investment',
            normalizedIntentType as 'deposit' | 'investment' | 'withdrawal',
            userId,
            createdAt,
          )

    // Create transaction intent
    const transactionIntent = await prisma.transactionIntent.create({
      data: {
        userId,
        accountId: account.id,
        accountType: normalizedAccountType.toUpperCase(),
        intentType: normalizedIntentType.toUpperCase(),
        amount: typeof amount === 'string' ? parseFloat(amount) : Number(amount),
        paymentMethod,
        investmentTranche,
        investmentTerm,
        userNotes,
        referenceNumber,
        providerTransactionId: providerTransactionId || null,
      }
    })

    // Send confirmation email to user
    await sendTransactionIntentEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      {
        type: normalizedIntentType as 'deposit' | 'investment' | 'withdrawal',
        amount: Number(transactionIntent.amount) || Number(transactionIntent.amount),
        paymentMethod,
        referenceNumber,
        accountType: normalizedAccountType as 'sama_naffa' | 'ape_investment' | 'ape_togo_investment',
        investmentTranche,
        investmentTerm,
        userNotes
      }
    )

    // Send notification email to admin
    await sendAdminNotificationEmail(
      process.env.ADMIN_EMAIL || 'admin@samanaffa.com',
      {
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userPhone: user.phone,
        type: normalizedIntentType as 'deposit' | 'investment' | 'withdrawal',
        amount: Number(transactionIntent.amount) || Number(transactionIntent.amount),
        paymentMethod,
        referenceNumber,
        accountType: normalizedAccountType as 'sama_naffa' | 'ape_investment' | 'ape_togo_investment',
        investmentTranche,
        investmentTerm,
        userNotes
      }
    )

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
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const accountId = searchParams.get('accountId')
    const accountType = searchParams.get('accountType')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = { userId }
    if (accountId) {
      where.accountId = accountId
    }
    if (accountType) {
      where.accountType = accountType.toUpperCase()
    }

    // Get total count for pagination
    const totalCount = await prisma.transactionIntent.count({
      where
    })

    const transactionIntents = await prisma.transactionIntent.findMany({
      where,
      include: {
        account: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return NextResponse.json({
      success: true,
      transactionIntents,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
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
