import { NextRequest, NextResponse } from 'next/server';
// Prisma types no longer needed with Drizzle
import { prisma } from '@/lib/prisma';
import { sendTransactionIntentEmail } from '@/lib/notifications';

/**
 * Manual Callback Endpoint
 * 
 * This endpoint processes payment information from redirect URL parameters
 * when InTouch callbacks are not being received. It's a fallback mechanism
 * to ensure payments are processed even if server-to-server callbacks fail.
 * 
 * This should only be used as a temporary solution until InTouch properly
 * configures their callback system.
 */

type CallbackStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

function appendAdminNote(existing: string | null | undefined, note: string): string {
  return existing ? `${existing}\n${note}` : note;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[Manual Callback] Processing manual callback from redirect:', body);

    const {
      referenceNumber,
      errorCode,
      num_transaction_from_gu,
      amount: callbackAmount,
    } = body;

    // Validate required fields
    if (!referenceNumber) {
      console.error('[Manual Callback] Missing referenceNumber');
      return NextResponse.json(
        { error: 'Missing referenceNumber' },
        { status: 400 }
      );
    }

    if (!errorCode && errorCode !== 0) {
      console.error('[Manual Callback] Missing errorCode');
      return NextResponse.json(
        { error: 'Missing errorCode' },
        { status: 400 }
      );
    }

    // Map error code to status
    let mappedStatus: CallbackStatus;
    const errorCodeStr = String(errorCode).trim();
    
    if (errorCodeStr === '200' || errorCodeStr === '0' || errorCodeStr === '00') {
      mappedStatus = 'COMPLETED';
    } else if (errorCodeStr === '420') {
      mappedStatus = 'FAILED';
    } else if (errorCodeStr.startsWith('1') || errorCodeStr.startsWith('2')) {
      mappedStatus = 'PENDING';
    } else {
      mappedStatus = 'FAILED';
    }

    console.log('[Manual Callback] Status mapping:', {
      errorCode: errorCodeStr,
      mappedStatus,
    });

    // Find the transaction intent
    const intent = await prisma.transactionIntent.findUnique({
      where: { referenceNumber },
      include: {
        user: true,
        account: true,
      },
    });

    if (!intent) {
      console.error('[Manual Callback] Transaction intent not found:', referenceNumber);
      return NextResponse.json(
        { error: 'Transaction intent not found' },
        { status: 404 }
      );
    }

    console.log('[Manual Callback] Found transaction intent:', {
      id: intent.id,
      currentStatus: intent.status,
      amount: intent.amount.toString(),
    });

    // Check if already processed
    if (intent.status === 'COMPLETED') {
      console.log('[Manual Callback] Transaction already completed, skipping');
      return NextResponse.json({
        success: true,
        message: 'Transaction already processed',
        status: 'COMPLETED',
        transactionId: intent.id,
      });
    }

    // Verify amount if provided
    if (callbackAmount) {
      const expectedAmount = parseFloat(intent.amount);
      const receivedAmount = parseFloat(callbackAmount);
      
      if (expectedAmount !== receivedAmount) {
        console.error('[Manual Callback] Amount mismatch:', {
          expected: expectedAmount,
          received: receivedAmount,
        });
        return NextResponse.json(
          {
            error: 'Amount mismatch',
            expected: expectedAmount,
            received: receivedAmount,
          },
          { status: 400 }
        );
      }
    }

    // Process the transaction
    const transactionResult = await prisma.$transaction(async (tx: any) => {
      const currentIntent = await tx.transactionIntent.findUnique({
        where: { id: intent.id },
        include: { account: true, user: true },
      });

      if (!currentIntent) {
        throw new Error('INTENT_NOT_FOUND');
      }

      const currentBalance = parseFloat(currentIntent.account.balance);
      const transactionAmount = parseFloat(currentIntent.amount);

      let finalStatus: CallbackStatus = mappedStatus;
      let failureReason: string | null = null;
      let shouldUpdateBalance = false;

      if (mappedStatus === 'COMPLETED') {
        if (currentIntent.intentType === 'WITHDRAWAL') {
          if (currentBalance < transactionAmount) {
            finalStatus = 'FAILED';
            failureReason = 'Insufficient funds for withdrawal';
          } else if (currentIntent.status !== 'COMPLETED') {
            shouldUpdateBalance = true;
          }
        } else if (currentIntent.status !== 'COMPLETED') {
          shouldUpdateBalance = true;
        }
      }

      const statusChangedToCompleted = 
        currentIntent.status !== 'COMPLETED' && finalStatus === 'COMPLETED';

      const adminNote = appendAdminNote(
        currentIntent.adminNotes,
        `Manual callback processed from redirect URL. Error code: ${errorCodeStr}${num_transaction_from_gu ? `, InTouch TX: ${num_transaction_from_gu}` : ''} at ${new Date().toISOString()}`
      );

      const updateData: any = {
        providerStatus: errorCodeStr,
        lastCallbackAt: new Date(),
        adminNotes: adminNote,
      };

      if (num_transaction_from_gu && !currentIntent.providerTransactionId) {
        updateData.providerTransactionId = String(num_transaction_from_gu);
      }

      if (currentIntent.status !== finalStatus) {
        updateData.status = finalStatus;
      }

      const updatedIntent = await tx.transactionIntent.update({
        where: { id: currentIntent.id },
        data: updateData,
        include: { account: true, user: true },
      });

      // Log the callback
      await tx.paymentCallbackLog.create({
        data: {
          transactionIntentId: updatedIntent.id,
          status: `MANUAL_${errorCodeStr}`,
          payload: body,
        },
      });

      // Update balance if needed
      if (shouldUpdateBalance && finalStatus === 'COMPLETED') {
        const newBalance =
          currentIntent.intentType === 'WITHDRAWAL'
            ? (currentBalance - transactionAmount).toFixed(2)
            : (currentBalance + transactionAmount).toFixed(2);

        await tx.userAccount.update({
          where: { id: updatedIntent.accountId },
          data: { balance: newBalance },
        });

        updatedIntent.account.balance = newBalance;
        
        console.log('[Manual Callback] Balance updated:', {
          accountId: updatedIntent.accountId,
          oldBalance: currentBalance.toString(),
          newBalance: newBalance.toString(),
          intentType: currentIntent.intentType,
        });
      }

      return {
        updatedIntent,
        finalStatus,
        failureReason,
        statusChangedToCompleted,
      };
    });

    const { updatedIntent, finalStatus, failureReason, statusChangedToCompleted } = transactionResult;

    console.log('[Manual Callback] Transaction processed:', {
      intentId: updatedIntent.id,
      oldStatus: intent.status,
      newStatus: finalStatus,
      statusChangedToCompleted,
    });

    // Send email notification if completed
    if (statusChangedToCompleted) {
      console.log('[Manual Callback] Sending email notification');
      await sendTransactionIntentEmail(
        updatedIntent.user.email,
        `${updatedIntent.user.firstName} ${updatedIntent.user.lastName}`,
        {
          type: updatedIntent.intentType.toLowerCase() as 'deposit' | 'investment' | 'withdrawal',
          amount: Number(updatedIntent.amount),
          paymentMethod: updatedIntent.paymentMethod,
          referenceNumber: updatedIntent.referenceNumber,
          accountType: updatedIntent.accountType.toLowerCase() as 'sama_naffa' | 'ape_investment',
          investmentTranche: updatedIntent.investmentTranche || undefined,
          investmentTerm: updatedIntent.investmentTerm || undefined,
          userNotes: updatedIntent.userNotes || undefined,
        }
      );
    }

    const responsePayload = {
      success: finalStatus === 'COMPLETED',
      transactionId: updatedIntent.id,
      status: finalStatus,
      providerTransactionId: updatedIntent.providerTransactionId,
      message:
        finalStatus === 'COMPLETED'
          ? 'Transaction completed successfully'
          : `Transaction ${finalStatus.toLowerCase()}`,
      ...(failureReason && { failureReason }),
    };

    const statusCode = finalStatus === 'COMPLETED' ? 200 : 420;
    return NextResponse.json(responsePayload, { status: statusCode });

  } catch (error) {
    console.error('[Manual Callback] Error processing manual callback:', error);
    
    const failureMessage = error instanceof Error ? error.message : 'Internal server error';

    if (failureMessage === 'INTENT_NOT_FOUND') {
      return NextResponse.json({ error: 'Transaction intent not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal server error', details: failureMessage },
      { status: 500 }
    );
  }
}



