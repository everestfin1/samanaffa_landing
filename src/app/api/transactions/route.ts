import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { transactionIntents, userAccounts, users } from '@/lib/db/schema';

async function loadTransactionWithRelations(referenceNumber?: string | null, transactionId?: string | null) {
  let intent;
  if (referenceNumber) {
    ;[intent] = await db
      .select()
      .from(transactionIntents)
      .where(eq(transactionIntents.referenceNumber, referenceNumber))
      .limit(1);
  } else if (transactionId) {
    ;[intent] = await db
      .select()
      .from(transactionIntents)
      .where(eq(transactionIntents.id, transactionId))
      .limit(1);
  } else {
    return null;
  }

  if (!intent) return null;

  const [[account], [user]] = await Promise.all([
    db
      .select({
        id: userAccounts.id,
        accountNumber: userAccounts.accountNumber,
        accountType: userAccounts.accountType,
        balance: userAccounts.balance,
      })
      .from(userAccounts)
      .where(eq(userAccounts.id, intent.accountId))
      .limit(1),
    db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, intent.userId))
      .limit(1),
  ]);

  return {
    ...intent,
    account: account ?? null,
    user: user ?? null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const referenceNumber = searchParams.get('referenceNumber');
    const transactionId = searchParams.get('transactionId');

    if (!referenceNumber && !transactionId) {
      return NextResponse.json(
        { error: 'Either referenceNumber or transactionId is required' },
        { status: 400 },
      );
    }

    if (referenceNumber) {
      console.log('[API /transactions] Looking up transaction by reference:', referenceNumber);
    } else if (transactionId) {
      console.log('[API /transactions] Looking up transaction by ID:', transactionId);
    }

    const transaction = await loadTransactionWithRelations(referenceNumber, transactionId);

    if (!transaction) {
      console.log('[API /transactions] Transaction not found');
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 },
      );
    }

    if (transaction.userId !== token.sub) {
      console.log('[API /transactions] User does not own this transaction');
      return NextResponse.json(
        { error: 'Unauthorized - transaction belongs to another user' },
        { status: 403 },
      );
    }

    console.log('[API /transactions] Transaction found:', {
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount?.toString(),
    });

    return NextResponse.json({
      success: true,
      transactions: [transaction],
    });
  } catch (error) {
    console.error('[API /transactions] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
