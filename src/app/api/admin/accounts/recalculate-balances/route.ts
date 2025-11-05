import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { calculateAccountBalance } from '@/lib/utils'

export async function POST(request: NextRequest) {
  // Verify admin authentication
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    // Get all user accounts
    const accounts = await prisma.userAccount.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    const results: Array<{
      accountId: string;
      accountNumber: string;
      accountType: string;
      user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
      oldBalance: number;
      newBalance: number;
      difference: number;
      transactionCount: number;
    }> = []

    for (const account of accounts) {
      // Get all completed transactions for this account
      const completedTransactions = await prisma.transactionIntent.findMany({
        where: {
          accountId: account.id,
          status: 'COMPLETED'
        }
      })

      // Calculate the correct balance
      const correctBalance = calculateAccountBalance(
        completedTransactions.map(t => ({
          intentType: t.intentType.toString(),
          amount: Number(t.amount)
        }))
      )

      // Update the account balance if it's different
      if (Number(account.balance) !== correctBalance) {
        await prisma.userAccount.update({
          where: { id: account.id },
          data: { balance: correctBalance }
        })

        results.push({
          accountId: account.id,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          user: account.user,
          oldBalance: Number(account.balance),
          newBalance: correctBalance,
          difference: correctBalance - Number(account.balance),
          transactionCount: completedTransactions.length
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account balances recalculated successfully',
      results,
      totalAccounts: accounts.length,
      updatedAccounts: results.length
    })
  } catch (error) {
    console.error('Error recalculating account balances:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
