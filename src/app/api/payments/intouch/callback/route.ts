import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTransactionIntentEmail } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Intouch callback data structure
    const {
      transactionId,
      status,
      amount,
      referenceNumber,
      paymentMethod,
      customerInfo,
      timestamp
    } = body;

    console.log('Intouch callback received:', {
      transactionId,
      status,
      amount,
      referenceNumber
    });

    // Validate required fields
    if (!transactionId || !status || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the transaction intent by reference number
    const transactionIntent = await prisma.transactionIntent.findUnique({
      where: { referenceNumber },
      include: {
        user: true,
        account: true
      }
    });

    if (!transactionIntent) {
      console.error('Transaction intent not found:', referenceNumber);
      return NextResponse.json(
        { error: 'Transaction intent not found' },
        { status: 404 }
      );
    }

    // Update transaction status based on Intouch response
    let newStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' = 'PENDING';
    
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        newStatus = 'COMPLETED';
        break;
      case 'failed':
      case 'error':
        newStatus = 'FAILED';
        break;
      case 'cancelled':
        newStatus = 'CANCELLED';
        break;
      default:
        newStatus = 'PENDING';
    }

    // Update the transaction intent
    const updatedIntent = await prisma.transactionIntent.update({
      where: { id: transactionIntent.id },
      data: {
        status: newStatus,
        adminNotes: `Intouch payment ${status} - Transaction ID: ${transactionId}`
      }
    });

    // If payment was successful, update account balance
    if (newStatus === 'COMPLETED') {
      const account = transactionIntent.account;
      const currentBalance = Number(account.balance);
      const transactionAmount = Number(transactionIntent.amount);
      let newBalance = currentBalance;

      // Calculate new balance based on transaction type
      if (transactionIntent.intentType === 'DEPOSIT') {
        newBalance = currentBalance + transactionAmount;
      } else if (transactionIntent.intentType === 'WITHDRAWAL') {
        newBalance = currentBalance - transactionAmount;
        // Ensure balance doesn't go negative
        if (newBalance < 0) {
          console.error('Insufficient funds for withdrawal:', {
            accountId: account.id,
            currentBalance,
            transactionAmount
          });
          // Revert transaction status
          await prisma.transactionIntent.update({
            where: { id: transactionIntent.id },
            data: { 
              status: 'FAILED',
              adminNotes: 'Insufficient funds for withdrawal'
            }
          });
          return NextResponse.json(
            { error: 'Insufficient funds for withdrawal' },
            { status: 400 }
          );
        }
      }

      // Update the account balance
      await prisma.userAccount.update({
        where: { id: account.id },
        data: { balance: newBalance }
      });

      console.log(`Account balance updated: ${account.accountNumber} = ${newBalance}`);
    }

    // Send confirmation email to user
    if (newStatus === 'COMPLETED') {
      await sendTransactionIntentEmail(
        transactionIntent.user.email,
        `${transactionIntent.user.firstName} ${transactionIntent.user.lastName}`,
        {
          type: transactionIntent.intentType.toLowerCase() as 'deposit' | 'investment' | 'withdrawal',
          amount: Number(transactionIntent.amount),
          paymentMethod: 'Intouch',
          referenceNumber: transactionIntent.referenceNumber,
          accountType: transactionIntent.accountType.toLowerCase() as 'sama_naffa' | 'ape_investment',
          investmentTranche: transactionIntent.investmentTranche || undefined,
          investmentTerm: transactionIntent.investmentTerm || undefined,
          userNotes: transactionIntent.userNotes || undefined
        }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: updatedIntent.id,
      status: newStatus,
      message: `Transaction ${newStatus.toLowerCase()} successfully`
    });

  } catch (error) {
    console.error('Intouch callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ status: 'Intouch webhook endpoint active' });
}
