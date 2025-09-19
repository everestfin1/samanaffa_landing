import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const accounts = await prisma.userAccount.findMany({
      where: { userId: (session?.user as any).id },
      include: {
        transactionIntents: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Get last 5 transactions
        }
      }
    })

    return NextResponse.json({
      success: true,
      accounts: accounts.map(account => ({
        id: account.id,
        accountType: account.accountType,
        accountNumber: account.accountNumber,
        balance: account.balance,
        status: account.status,
        createdAt: account.createdAt,
        recentTransactions: account.transactionIntents.map(intent => ({
          id: intent.id,
          intentType: intent.intentType,
          amount: intent.amount,
          status: intent.status,
          referenceNumber: intent.referenceNumber,
          createdAt: intent.createdAt
        }))
      }))
    })
  } catch (error) {
    console.error('Error fetching user accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
