import { NextRequest, NextResponse } from 'next/server'
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

    // Validate required fields
    if (!userId || !accountType || !intentType || !amount || !paymentMethod) {
      return respondError('missing_fields', 'Missing required fields', 400)
    }

    if (providerTransactionId && typeof providerTransactionId !== 'string') {
      return respondError('invalid_provider_transaction_id', 'Invalid provider transaction identifier', 400)
    }

    // Validate account type
    if (!['sama_naffa', 'ape_investment'].includes(accountType)) {
      return respondError('invalid_account_type', 'Invalid account type', 400)
    }

    // Validate intent type
    if (!['deposit', 'investment', 'withdrawal'].includes(intentType)) {
      return respondError('invalid_intent_type', 'Invalid intent type', 400)
    }

    // For APE investments, validate tranche and term
    if (accountType === 'ape_investment' && intentType === 'investment') {
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
          where: { accountType: accountType.toUpperCase() }
        }
      }
    })

    if (!user) {
      return respondError('user_not_found', 'User not found', 404)
    }

    // Check KYC status - only allow transactions for approved users
    if (user.kycStatus !== 'APPROVED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Vérification d\'identité requise pour effectuer des transactions. Veuillez attendre la validation de vos documents.',
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
    const createdAt = new Date()

    // Generate reference number
    const referenceNumber =
      typeof providedReferenceNumber === 'string' && providedReferenceNumber.trim().length > 0
        ? providedReferenceNumber.trim()
        : generateReferenceNumber(
            accountType as 'sama_naffa' | 'ape_investment',
            intentType as 'deposit' | 'investment' | 'withdrawal',
            userId,
            createdAt,
          )

    // Create transaction intent
    const transactionIntent = await prisma.transactionIntent.create({
      data: {
        userId,
        accountId: account.id,
        accountType: accountType.toUpperCase(),
        intentType: intentType.toUpperCase(),
        amount: parseFloat(amount),
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
        type: intentType as 'deposit' | 'investment' | 'withdrawal',
        amount: parseFloat(amount),
        paymentMethod,
        referenceNumber,
        accountType: accountType as 'sama_naffa' | 'ape_investment',
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
        type: intentType as 'deposit' | 'investment' | 'withdrawal',
        amount: parseFloat(amount),
        paymentMethod,
        referenceNumber,
        accountType: accountType as 'sama_naffa' | 'ape_investment',
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get total count for pagination
    const totalCount = await prisma.transactionIntent.count({
      where: { userId }
    })

    const transactionIntents = await prisma.transactionIntent.findMany({
      where: { userId },
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
