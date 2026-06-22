import { NextRequest, NextResponse } from 'next/server'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { transactionIntents, userAccounts, users } from '@/lib/db/schema'
import { verifyAdminAuth, createErrorResponse } from '@/lib/admin-auth'
import { calculateAccountBalance } from '@/lib/utils'

export async function POST(request: NextRequest) {
  const { error, user } = await verifyAdminAuth(request)
  
  if (error || !user) {
    return createErrorResponse('Unauthorized', 401)
  }

  try {
    const accounts = await db
      .select({
        id: userAccounts.id,
        userId: userAccounts.userId,
        accountNumber: userAccounts.accountNumber,
        accountType: userAccounts.accountType,
        balance: userAccounts.balance,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        userEmail: users.email,
      })
      .from(userAccounts)
      .innerJoin(users, eq(userAccounts.userId, users.id))

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

    const accountIds = accounts.map((a) => a.id)

    const completedTransactions = accountIds.length > 0
      ? await db
          .select()
          .from(transactionIntents)
          .where(
            and(
              inArray(transactionIntents.accountId, accountIds),
              eq(transactionIntents.status, 'COMPLETED'),
            ),
          )
      : []

    const completedByAccount = new Map<string, typeof completedTransactions>()
    for (const tx of completedTransactions) {
      const list = completedByAccount.get(tx.accountId) ?? []
      list.push(tx)
      completedByAccount.set(tx.accountId, list)
    }

    for (const account of accounts) {
      const accountTxs = completedByAccount.get(account.id) ?? []

      const correctBalance = calculateAccountBalance(
        accountTxs.map((t) => ({
          intentType: t.intentType.toString(),
          amount: Number(t.amount),
        }))
      )

      if (Number(account.balance) !== correctBalance) {
        await db
          .update(userAccounts)
          .set({ balance: correctBalance.toFixed(2) })
          .where(eq(userAccounts.id, account.id))

        results.push({
          accountId: account.id,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          user: {
            id: account.userId,
            firstName: account.userFirstName,
            lastName: account.userLastName,
            email: account.userEmail,
          },
          oldBalance: Number(account.balance),
          newBalance: correctBalance,
          difference: correctBalance - Number(account.balance),
          transactionCount: accountTxs.length,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account balances recalculated successfully',
      results,
      totalAccounts: accounts.length,
      updatedAccounts: results.length,
    })
  } catch (error) {
    console.error('Error recalculating account balances:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
