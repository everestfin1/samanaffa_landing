import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { generateReferenceNumber } from '@/lib/utils'
import { sendTransactionIntentEmail, sendAdminNotificationEmail } from '@/lib/notifications'

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
      accountId,
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

    const normalizedAccountType = (accountType ?? '').toString().toLowerCase()
    const normalizedIntentType = (intentType ?? '').toString().toLowerCase()

    // Validate required fields
    if (!userId || !normalizedAccountType || !normalizedIntentType || amount === undefined || amount === null || !paymentMethod) {
      return respondError('missing_fields', 'Missing required fields', 400)
    }

    if (providerTransactionId && typeof providerTransactionId !== 'string') {
      return respondError('invalid_provider_transaction_id', 'Invalid provider transaction identifier', 400)
    }

    // Validate account type
    if (!['sama_naffa', 'ape_investment'].includes(normalizedAccountType)) {
      return respondError('invalid_account_type', 'Invalid account type', 400)
    }

    // Validate intent type
    if (!['deposit', 'investment', 'withdrawal'].includes(normalizedIntentType)) {
      return respondError('invalid_intent_type', 'Invalid intent type', 400)
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: {
            accountType: normalizedAccountType.toUpperCase(),
            ...(accountId && { id: accountId })
          }
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

    if (!user.accounts.length) {
      return respondError('account_not_found', 'Account not found', 404)
    }

    const account = user.accounts[0]
    if (accountId && account.id !== accountId) {
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
            normalizedAccountType as 'sama_naffa' | 'ape_investment',
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
        amount: transactionIntent.amount.toNumber ? transactionIntent.amount.toNumber() : Number(transactionIntent.amount),
        paymentMethod,
        referenceNumber,
        accountType: normalizedAccountType as 'sama_naffa' | 'ape_investment',
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
        amount: transactionIntent.amount.toNumber ? transactionIntent.amount.toNumber() : Number(transactionIntent.amount),
        paymentMethod,
        referenceNumber,
        accountType: normalizedAccountType as 'sama_naffa' | 'ape_investment',
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
