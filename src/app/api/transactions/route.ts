import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
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

    let transaction = null;

    if (referenceNumber) {
      console.log('[API /transactions] Looking up transaction by reference:', referenceNumber);
      transaction = await prisma.transactionIntent.findUnique({
        where: { referenceNumber },
        include: {
          account: {
            select: {
              id: true,
              accountNumber: true,
              accountType: true,
              balance: true,
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      });
    } else if (transactionId) {
      console.log('[API /transactions] Looking up transaction by ID:', transactionId);
      transaction = await prisma.transactionIntent.findUnique({
        where: { id: transactionId },
        include: {
          account: {
            select: {
              id: true,
              accountNumber: true,
              accountType: true,
              balance: true,
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        }
      });
    }

    if (!transaction) {
      console.log('[API /transactions] Transaction not found');
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Verify user owns this transaction
    if (transaction.userId !== token.sub) {
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

