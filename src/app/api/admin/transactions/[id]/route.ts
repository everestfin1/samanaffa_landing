import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { logTransactionUpdate } from '@/lib/audit-logger'

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
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // First, get the current transaction intent to check if we need to update balance
    const currentIntent = await prisma.transactionIntent.findUnique({
      where: { id },
      include: {
        account: true
      }
    })

    if (!currentIntent) {
      return NextResponse.json(
        { error: 'Transaction intent not found' },
        { status: 404 }
      )
    }

    // Handle balance updates based on status changes
    if (status.toUpperCase() === 'COMPLETED' && currentIntent.status !== 'COMPLETED') {
      // Transaction is being completed - add/subtract from balance
      const account = currentIntent.account
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

      // Calculate new balance based on transaction type
      if (currentIntent.intentType === 'DEPOSIT') {
        newBalance = currentBalance + transactionAmount
        console.log(`Deposit: ${currentBalance} + ${transactionAmount} = ${newBalance}`)
      } else if (currentIntent.intentType === 'WITHDRAWAL') {
        newBalance = currentBalance - transactionAmount
        console.log(`Withdrawal: ${currentBalance} - ${transactionAmount} = ${newBalance}`)
        // Ensure balance doesn't go negative
        if (newBalance < 0) {
          return NextResponse.json(
            { error: 'Insufficient funds for withdrawal' },
            { status: 400 }
          )
        }
      }
      // For INVESTMENT type, we don't change the balance as it's a separate investment account

      // Update the account balance
      await prisma.userAccount.update({
        where: { id: account.id },
        data: { balance: newBalance }
      })

      console.log(`Account balance updated: ${account.accountNumber} = ${newBalance}`)
    } else if (currentIntent.status === 'COMPLETED' && status.toUpperCase() !== 'COMPLETED') {
      // Transaction is being reverted from completed - reverse the balance change
      const account = currentIntent.account
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

      // Reverse the balance change
      if (currentIntent.intentType === 'DEPOSIT') {
        newBalance = currentBalance - transactionAmount
        console.log(`Reverting deposit: ${currentBalance} - ${transactionAmount} = ${newBalance}`)
        // Ensure balance doesn't go negative
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
      // For INVESTMENT type, we don't change the balance as it's a separate investment account

      // Update the account balance
      await prisma.userAccount.update({
        where: { id: account.id },
        data: { balance: newBalance }
      })

      console.log(`Account balance reverted: ${account.accountNumber} = ${newBalance}`)
    }

    // Update the transaction intent
    const updatedIntent = await prisma.transactionIntent.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        adminNotes,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        account: {
          select: {
            accountNumber: true,
            accountType: true,
            balance: true,
          }
        }
      }
    })

    // Log the transaction update
    await logTransactionUpdate(
      user.id,
      id,
      currentIntent.status,
      status.toUpperCase(),
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Transaction intent updated successfully',
      transactionIntent: {
        id: updatedIntent.id,
        referenceNumber: updatedIntent.referenceNumber,
        user: {
          id: updatedIntent.user.id,
          name: `${updatedIntent.user.firstName} ${updatedIntent.user.lastName}`,
          email: updatedIntent.user.email,
          phone: updatedIntent.user.phone,
        },
        account: {
          accountNumber: updatedIntent.account.accountNumber,
          accountType: updatedIntent.account.accountType,
          balance: updatedIntent.account.balance,
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
      }
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

    const transactionIntent = await prisma.transactionIntent.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            kycStatus: true,
          }
        },
        account: {
          select: {
            accountNumber: true,
            accountType: true,
            balance: true,
          }
        }
      }
    })

    if (!transactionIntent) {
      return NextResponse.json(
        { error: 'Transaction intent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      transactionIntent: {
        id: transactionIntent.id,
        referenceNumber: transactionIntent.referenceNumber,
        user: {
          id: transactionIntent.user.id,
          name: `${transactionIntent.user.firstName} ${transactionIntent.user.lastName}`,
          email: transactionIntent.user.email,
          phone: transactionIntent.user.phone,
          kycStatus: transactionIntent.user.kycStatus,
        },
        account: {
          accountNumber: transactionIntent.account.accountNumber,
          accountType: transactionIntent.account.accountType,
          balance: transactionIntent.account.balance,
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
      }
    })
  } catch (error) {
    console.error('Error fetching transaction intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
