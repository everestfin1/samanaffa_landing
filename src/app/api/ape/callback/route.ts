import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apeSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Normalize payment status from various providers
function normalizeStatus(status: string): 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'PENDING' {
  const normalizedStatus = status.toLowerCase().trim();
  
  const successStatuses = ['success', 'completed', 'paid', 'ok', 'processed', 'approved'];
  const failedStatuses = ['failed', 'error', 'declined', 'rejected', 'timeout', 'cancelled', 'canceled', 'aborted'];
  
  if (successStatuses.includes(normalizedStatus)) {
    return 'PAYMENT_SUCCESS';
  }
  
  if (failedStatuses.includes(normalizedStatus)) {
    return 'PAYMENT_FAILED';
  }
  
  return 'PENDING';
}

export async function POST(request: NextRequest) {
  try {
    // Parse the callback payload
    let payload: Record<string, unknown>;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    } else {
      // Try JSON first, then form data
      try {
        payload = await request.json();
      } catch {
        const text = await request.text();
        payload = Object.fromEntries(new URLSearchParams(text).entries());
      }
    }

    console.log('[APE Callback] Received callback:', JSON.stringify(payload, null, 2));

    // Extract reference number and transaction details
    // Intouch may use different field names
    const referenceNumber = 
      payload.referenceNumber as string ||
      payload.reference_number as string ||
      payload.orderNumber as string ||
      payload.order_number as string ||
      payload.merchantReference as string ||
      payload.merchant_reference as string;

    const providerTransactionId = 
      payload.transactionId as string ||
      payload.transaction_id as string ||
      payload.intouchTransactionId as string ||
      payload.intouch_transaction_id as string ||
      payload.externalTransactionId as string;

    const providerStatus = 
      payload.status as string ||
      payload.paymentStatus as string ||
      payload.payment_status as string ||
      'unknown';

    if (!referenceNumber) {
      console.error('[APE Callback] Missing reference number in callback');
      return NextResponse.json(
        { success: false, error: 'Missing reference number' },
        { status: 400 }
      );
    }

    // Find the subscription
    const [subscription] = await db
      .select()
      .from(apeSubscriptions)
      .where(eq(apeSubscriptions.referenceNumber, referenceNumber))
      .limit(1);

    if (!subscription) {
      console.error('[APE Callback] Subscription not found:', referenceNumber);
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Normalize and update status
    const normalizedStatus = normalizeStatus(providerStatus);
    
    const [updatedSubscription] = await db
      .update(apeSubscriptions)
      .set({
        status: normalizedStatus,
        providerTransactionId: providerTransactionId || subscription.providerTransactionId,
        providerStatus,
        paymentCallbackPayload: payload,
        paymentCompletedAt: normalizedStatus !== 'PENDING' ? new Date() : subscription.paymentCompletedAt,
      })
      .where(eq(apeSubscriptions.referenceNumber, referenceNumber))
      .returning();

    console.log('[APE Callback] Updated subscription:', {
      referenceNumber,
      previousStatus: subscription.status,
      newStatus: normalizedStatus,
      providerTransactionId,
    });

    // TODO: Send email notification based on status
    if (normalizedStatus === 'PAYMENT_SUCCESS') {
      console.log('[APE Callback] Payment successful - should send confirmation email to:', subscription.email);
      // await sendConfirmationEmail(subscription);
    } else if (normalizedStatus === 'PAYMENT_FAILED') {
      console.log('[APE Callback] Payment failed - should send failure notification to:', subscription.email);
      // await sendFailureEmail(subscription);
    }

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
      status: normalizedStatus,
    });
  } catch (error) {
    console.error('[APE Callback] Error processing callback:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing callback' },
      { status: 500 }
    );
  }
}

// GET endpoint for verification (some providers ping this to verify the endpoint)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const referenceNumber = searchParams.get('referenceNumber');

  if (referenceNumber) {
    // Return subscription status if reference provided
    const [subscription] = await db
      .select()
      .from(apeSubscriptions)
      .where(eq(apeSubscriptions.referenceNumber, referenceNumber))
      .limit(1);

    if (subscription) {
      return NextResponse.json({
        success: true,
        status: subscription.status,
        referenceNumber: subscription.referenceNumber,
      });
    }
  }

  // Default response for endpoint verification
  return NextResponse.json({
    success: true,
    message: 'APE Payment Callback Endpoint Active',
    timestamp: new Date().toISOString(),
  });
}
