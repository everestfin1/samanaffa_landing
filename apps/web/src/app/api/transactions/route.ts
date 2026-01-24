import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/get-session';
import { db } from '@/lib/db';
import { transactionIntents, userAccounts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated<
    const session = await getServerSession(request);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const referenceNumber = searchParams.get('referenceNumber');
    const transactionId = searchParams.get('transactionId');

    // Require at least one search parameter
    if (!referenceNumber && !transactionId) {
      return NextResponse.json(
        { error: 'Either referenceNumber or transactionId is required' },
        { status: 400 }
      );
    }

    let transaction: any = null;
    let row: any = null;

    if (referenceNumber) {
      console.log('[API /transactions] Looking up transaction by reference:', referenceNumber);
      row = await db
        .select({
          intent: transactionIntents,
          account: userAccounts,
          user: users,
        })
        .from(transactionIntents)
        .leftJoin(userAccounts, eq(transactionIntents.accountId, userAccounts.id))
        .leftJoin(users, eq(transactionIntents.userId, users.id))
        .where(eq(transactionIntents.referenceNumber, referenceNumber))
        .limit(1)
        .then((rows) => rows[0] ?? null)
    } else if (transactionId) {
      console.log('[API /transactions] Looking up transaction by ID:', transactionId);
      row = await db
        .select({
          intent: transactionIntents,
          account: userAccounts,
          user: users,
        })
        .from(transactionIntents)
        .leftJoin(userAccounts, eq(transactionIntents.accountId, userAccounts.id))
        .leftJoin(users, eq(transactionIntents.userId, users.id))
        .where(eq(transactionIntents.id, transactionId))
        .limit(1)
        .then((rows) => rows[0] ?? null)
    }

    if (row?.intent) {
      transaction = {
        ...row.intent,
        account: row.account
          ? {
              id: row.account.id,
              accountNumber: row.account.accountNumber,
              accountType: row.account.accountType,
              balance: row.account.balance,
            }
          : null,
        user: row.user
          ? {
              id: row.user.id,
              firstName: row.user.firstName,
              lastName: row.user.lastName,
              email: row.user.email,
            }
          : null,
      }
    }

    if (!transaction) {
      console.log('[API /transactions] Transaction not found');
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Verify user owns this transaction
    if (transaction.userId !== session.user.id) {
      console.log('[API /transactions] User does not own this transaction');
      return NextResponse.json(
        { error: 'Unauthorized - transaction belongs to another user' },
        { status: 403 }
      );
    }

    console.log('[API /transactions] Transaction found:', {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount?.toString(),
    });

    // Return in the format expected by the payment-success page
    return NextResponse.json({
      success: true,
      transactions: [transaction]
    });

  } catch (error) {
    console.error('[API /transactions] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

