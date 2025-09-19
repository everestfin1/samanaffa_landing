import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateReferenceNumber } from '@/lib/utils'
import { sendTransactionIntentEmail, sendAdminNotificationEmail } from '@/lib/notifications'

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
      userNotes
    } = await request.json()

    // Validate required fields
    if (!userId || !accountType || !intentType || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate account type
    if (!['sama_naffa', 'ape_investment'].includes(accountType)) {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }

    // Validate intent type
    if (!['deposit', 'investment', 'withdrawal'].includes(intentType)) {
      return NextResponse.json(
        { error: 'Invalid intent type' },
        { status: 400 }
      )
    }

    // For APE investments, validate tranche and term
    if (accountType === 'ape_investment' && intentType === 'investment') {
      if (!investmentTranche || !['A', 'B', 'C', 'D'].includes(investmentTranche)) {
        return NextResponse.json(
          { error: 'Invalid investment tranche' },
          { status: 400 }
        )
      }
      if (!investmentTerm || ![3, 5, 7, 10].includes(investmentTerm)) {
        return NextResponse.json(
          { error: 'Invalid investment term' },
          { status: 400 }
        )
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!user.accounts.length) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }

    const account = user.accounts[0]
    const createdAt = new Date()

    // Generate reference number
    const referenceNumber = generateReferenceNumber(
      accountType as 'sama_naffa' | 'ape_investment',
      intentType as 'deposit' | 'investment' | 'withdrawal',
      userId,
      createdAt
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
      }
    })
  } catch (error) {
    console.error('Error creating transaction intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const transactionIntents = await prisma.transactionIntent.findMany({
      where: { userId },
      include: {
        account: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      transactionIntents
    })
  } catch (error) {
    console.error('Error fetching transaction intents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
