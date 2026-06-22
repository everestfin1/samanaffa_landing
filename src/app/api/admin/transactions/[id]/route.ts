import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { transactionIntents, userAccounts, users } from '@/lib/db/schema'
import type { TransactionStatus } from '@/lib/types'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { logTransactionUpdate } from '@/lib/audit-logger'

function formatBalance(value: number): string {
  return value.toFixed(2)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { id } = await params
    const { status, adminNotes } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED']
    const normalizedStatus = status.toUpperCase()
    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // First, get the current transaction intent to check if we need to update balance
    const [currentRow] = await db
      .select({
        intent: transactionIntents,
        account: userAccounts,
      })
      .from(transactionIntents)
      .innerJoin(userAccounts, eq(transactionIntents.accountId, userAccounts.id))
      .where(eq(transactionIntents.id, id))
      .limit(1)

    if (!currentRow) {
      return NextResponse.json(
        { error: 'Transaction intent not found' },
        { status: 404 }
      )
    }

    const currentIntent = currentRow.intent
    const account = currentRow.account

    // Handle balance updates based on status changes
    if (normalizedStatus === 'COMPLETED' && currentIntent.status !== 'COMPLETED') {
      const currentBalance = Number(account.balance)
      const transactionAmount = Number(currentIntent.amount)
      let newBalance = currentBalance

      console.log(`Processing transaction completion:`, {
        transactionId: currentIntent.id,
        accountId: account.id,
        intentType: currentIntent.intentType,
        amount: transactionAmount,
        currentBalance,
      })

      if (currentIntent.intentType === 'DEPOSIT') {
        newBalance = currentBalance + transactionAmount
        console.log(`Deposit: ${currentBalance} + ${transactionAmount} = ${newBalance}`)
      } else if (currentIntent.intentType === 'WITHDRAWAL') {
        newBalance = currentBalance - transactionAmount
        console.log(`Withdrawal: ${currentBalance} - ${transactionAmount} = ${newBalance}`)
        if (newBalance < 0) {
          return NextResponse.json(
            { error: 'Insufficient funds for withdrawal' },
            { status: 400 }
          )
        }
      }

      await db
        .update(userAccounts)
        .set({ balance: formatBalance(newBalance) })
        .where(eq(userAccounts.id, account.id))

      console.log(`Account balance updated: ${account.accountNumber} = ${newBalance}`)
    } else if (currentIntent.status === 'COMPLETED' && normalizedStatus !== 'COMPLETED') {
      const currentBalance = Number(account.balance)
      const transactionAmount = Number(currentIntent.amount)
      let newBalance = currentBalance

      console.log(`Reverting transaction completion:`, {
        transactionId: currentIntent.id,
        accountId: account.id,
        intentType: currentIntent.intentType,
        amount: transactionAmount,
        currentBalance,
      })

      if (currentIntent.intentType === 'DEPOSIT') {
        newBalance = currentBalance - transactionAmount
        console.log(`Reverting deposit: ${currentBalance} - ${transactionAmount} = ${newBalance}`)
        if (newBalance < 0) {
          return NextResponse.json(
            { error: 'Cannot revert deposit - insufficient funds' },
            { status: 400 }
          )
        }
      } else if (currentIntent.intentType === 'WITHDRAWAL') {
        newBalance = currentBalance + transactionAmount
        console.log(`Reverting withdrawal: ${currentBalance} + ${transactionAmount} = ${newBalance}`)
      }

      await db
        .update(userAccounts)
        .set({ balance: formatBalance(newBalance) })
        .where(eq(userAccounts.id, account.id))

      console.log(`Account balance reverted: ${account.accountNumber} = ${newBalance}`)
    }

    const [updatedIntent] = await db
      .update(transactionIntents)
      .set({
        status: normalizedStatus as TransactionStatus,
        adminNotes,
        updatedAt: new Date(),
      })
      .where(eq(transactionIntents.id, id))
      .returning()

    const [userData] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      })
      .from(users)
      .where(eq(users.id, updatedIntent.userId))
      .limit(1)

    const [accountData] = await db
      .select({
        accountNumber: userAccounts.accountNumber,
        accountType: userAccounts.accountType,
        balance: userAccounts.balance,
      })
      .from(userAccounts)
      .where(eq(userAccounts.id, updatedIntent.accountId))
      .limit(1)

    // Log the transaction update
    await logTransactionUpdate(
      user.id,
      id,
      currentIntent.status,
      normalizedStatus,
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Transaction intent updated successfully',
      transactionIntent: {
        id: updatedIntent.id,
        referenceNumber: updatedIntent.referenceNumber,
        user: {
          id: userData?.id,
          name: `${userData?.firstName} ${userData?.lastName}`,
          email: userData?.email,
          phone: userData?.phone,
        },
        account: {
          accountNumber: accountData?.accountNumber,
          accountType: accountData?.accountType,
          balance: accountData?.balance,
        },
        intentType: updatedIntent.intentType,
        amount: updatedIntent.amount,
        paymentMethod: updatedIntent.paymentMethod,
        investmentTranche: updatedIntent.investmentTranche,
        investmentTerm: updatedIntent.investmentTerm,
        userNotes: updatedIntent.userNotes,
        adminNotes: updatedIntent.adminNotes,
        status: updatedIntent.status,
        createdAt: updatedIntent.createdAt,
        updatedAt: updatedIntent.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error updating transaction intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }
  try {
    const { id } = await params

    const [row] = await db
      .select({
        intent: transactionIntents,
        userId: users.id,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userEmail: users.email,
        userPhone: users.phone,
        userKycStatus: users.kycStatus,
        accountNumber: userAccounts.accountNumber,
        accountType: userAccounts.accountType,
        accountBalance: userAccounts.balance,
      })
      .from(transactionIntents)
      .innerJoin(users, eq(transactionIntents.userId, users.id))
      .innerJoin(userAccounts, eq(transactionIntents.accountId, userAccounts.id))
      .where(eq(transactionIntents.id, id))
      .limit(1)

    if (!row) {
      return NextResponse.json(
        { error: 'Transaction intent not found' },
        { status: 404 }
      )
    }

    const transactionIntent = row.intent

    return NextResponse.json({
      success: true,
      transactionIntent: {
        id: transactionIntent.id,
        referenceNumber: transactionIntent.referenceNumber,
        user: {
          id: row.userId,
          name: `${row.userFirstName} ${row.userLastName}`,
          email: row.userEmail,
          phone: row.userPhone,
          kycStatus: row.userKycStatus,
        },
        account: {
          accountNumber: row.accountNumber,
          accountType: row.accountType,
          balance: row.accountBalance,
        },
        intentType: transactionIntent.intentType,
        amount: transactionIntent.amount,
        paymentMethod: transactionIntent.paymentMethod,
        investmentTranche: transactionIntent.investmentTranche,
        investmentTerm: transactionIntent.investmentTerm,
        userNotes: transactionIntent.userNotes,
        adminNotes: transactionIntent.adminNotes,
        status: transactionIntent.status,
        createdAt: transactionIntent.createdAt,
        updatedAt: transactionIntent.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching transaction intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
