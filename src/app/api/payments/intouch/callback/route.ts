import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
// Prisma types no longer needed with Drizzle
import { prisma } from '@/lib/prisma';
import { sendTransactionIntentEmail } from '@/lib/notifications';

type CallbackStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

const SIGNATURE_HEADER_CANDIDATES = ['x-intouch-signature', 'X-Intouch-Signature', 'x-signature'] as const;

const CALLBACK_STATUS_MAPPING: Record<string, CallbackStatus> = {
  success: 'COMPLETED',
  completed: 'COMPLETED',
  paid: 'COMPLETED',
  ok: 'COMPLETED',
  processed: 'COMPLETED',
  pending: 'PENDING',
  processing: 'PENDING',
  in_progress: 'PENDING',
  waiting: 'PENDING',
  init: 'PENDING',
  initialized: 'PENDING',
  failed: 'FAILED',
  error: 'FAILED',
  declined: 'FAILED',
  rejected: 'FAILED',
  timeout: 'FAILED',
  cancelled: 'CANCELLED',
  canceled: 'CANCELLED',
  aborted: 'CANCELLED',
};

const TRANSACTION_ID_KEYS = [
  'payment_token',           // Intouch specific field
  'transactionId',
  'transaction_id',
  'id',
  'intouchTransactionId',
  'num_transaction_from_gu',
  'numTransactionFromGu',
  'transactionReference',
  'reference_transaction',
];
const REFERENCE_KEYS = [
  'command_number',          // Intouch specific field
  'referenceNumber',
  'reference',
  'merchantReference',
  'merchantRef',
  'merchant_transaction_id',
  'num_command',
  'numCommand',
  'order_number',
  'orderNumber',
  'commande',
];
const STATUS_KEYS = [
  'payment_status',          // Intouch specific field
  'status',
  'transactionStatus',
  'state',
  'status_code',
  'statusCode',
  'code',
  'code_etat',
  'codeEtat',
  'errorCode',
  'error',
  'result',
];
const AMOUNT_KEYS = [
  'paid_amount',             // Intouch specific field
  'paid_sum',                // Intouch specific field (total)
  'amount',
  'transactionAmount',
  'montant',
  'montant_total',
  'montantTTC',
  'totalAmount',
  'amount_total',
];
const PAYMENT_METHOD_KEYS = [
  'payment_mode',            // Intouch specific field
  'paymentMethod',
  'payment_method',
  'paymentChannel',
  'channel',
  'moyen_paiement',
];
const TIMESTAMP_KEYS = [
  'payment_validation_date', // Intouch specific field
  'timestamp',
  'eventTimestamp',
  'date',
  'datetime',
  'date_transaction',
  'transactionDate',
];
const CUSTOMER_INFO_KEYS = ['customerInfo', 'customer', 'client', 'customer_info', 'client_info'];

function getHeaderSignature(request: NextRequest): string | null {
  for (const header of SIGNATURE_HEADER_CANDIDATES) {
    const value = request.headers.get(header);
    if (value) {
      return value;
    }
  }
  return null;
}

function normalizeSignature(signature: string): string {
  return signature.trim().toLowerCase().replace(/^sha256=/, '');
}

function verifySignature(rawBody: string, providedSignature: string, secret: string): boolean {
  const normalizedSignature = normalizeSignature(providedSignature);
  const expectedSignature = createHmac('sha256', secret).update(rawBody).digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const providedBuffer = Buffer.from(normalizedSignature, 'utf8');

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

function appendAdminNote(existing: string | null | undefined, note: string): string {
  return existing ? `${existing}\n${note}` : note;
}

function parseAmount(amount: unknown): Prisma.Decimal | null {
  try {
    if (amount === null || amount === undefined) return null;
    if (amount instanceof Prisma.Decimal) return amount;
    if (typeof amount === 'string' && amount.trim().length === 0) return null;
    return new Prisma.Decimal(amount as Prisma.Decimal.Value);
  } catch {
    return null;
  }
}

function toJsonValue(payload: unknown): Prisma.InputJsonValue {
  return payload as Prisma.InputJsonValue;
}

function pickFirst(body: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      const value = body[key];
      if (value !== undefined && value !== null && `${value}` !== '') {
        return value;
      }
    }
  }
  return undefined;
}

function coerceString(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'bigint') return String(value);
  return null;
}

function parseCustomerInfo(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as Prisma.InputJsonValue;
    } catch {
      return value;
    }
  }
  return value as Prisma.InputJsonValue;
}

export async function POST(request: NextRequest) {
  // Log all incoming headers for diagnostics
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = key.toLowerCase().includes('auth') || key.toLowerCase().includes('signature') 
      ? '***REDACTED***' 
      : value;
  });
  console.log('[Intouch Callback] POST request received');
  console.log('[Intouch Callback] Headers:', JSON.stringify(headers, null, 2));

  const webhookSecret = process.env.INTOUCH_WEBHOOK_SECRET;
  const allowUnsigned = process.env.INTOUCH_ALLOW_UNSIGNED_CALLBACKS === 'true';
  const basicAuthUsername = process.env.NODE_ENV === 'production' ? process.env.INTOUCH_BASIC_AUTH_USERNAME : process.env.INTOUCH_BASIC_AUTH_USERNAME_TEST;
  const basicAuthPassword = process.env.NODE_ENV === 'production' ? process.env.INTOUCH_BASIC_AUTH_PASSWORD : process.env.INTOUCH_BASIC_AUTH_PASSWORD_TEST;

  // Verify Basic Authentication (InTouch API requirement)
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    console.log('[Intouch Callback] Authorization header present:', authHeader.split(' ')[0]);
    
    if (authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      
      console.log('[Intouch Callback] Basic Auth - Username received:', username);
      
      // Verify credentials if configured
      if (basicAuthUsername && basicAuthPassword) {
        if (username !== basicAuthUsername || password !== basicAuthPassword) {
          console.error('[Intouch Callback] Basic Auth verification FAILED');
          return NextResponse.json(
            { error: 'Invalid authentication credentials' },
            { status: 401 },
          );
        }
        console.log('[Intouch Callback] Basic Auth verification PASSED');
      } else {
        console.warn('[Intouch Callback] Basic Auth credentials not configured, skipping verification');
      }
    }
  } else {
    console.warn('[Intouch Callback] No Authorization header present');
  }

  const rawBody = await request.text();
  if (!rawBody) {
    console.error('[Intouch Callback] Empty request body');
    return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
  }

  console.log('[Intouch Callback] Raw body length:', rawBody.length, 'bytes');

  // Check for HMAC signature (fallback/additional security)
  const signature = getHeaderSignature(request);
  if (signature) {
    console.log('[Intouch Callback] HMAC signature present');
    if (webhookSecret) {
      if (!verifySignature(rawBody, signature, webhookSecret)) {
        if (!allowUnsigned) {
          console.error('[Intouch Callback] HMAC signature verification FAILED');
          return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
        }
        console.warn('[Intouch Callback] HMAC signature verification failed, processing due to allow flag.');
      } else {
        console.log('[Intouch Callback] HMAC signature verification PASSED');
      }
    } else {
      console.warn('[Intouch Callback] Signature provided but webhook secret missing; skipping verification.');
    }
  } else if (!authHeader && !allowUnsigned) {
    console.error('[Intouch Callback] No authentication provided (no Basic Auth or HMAC signature)');
    return NextResponse.json({ error: 'Missing authentication' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';
  let parsedBody: Record<string, unknown> = {};

  try {
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(rawBody);
      params.forEach((value, key) => {
        parsedBody[key] = value;
      });
    } else {
      parsedBody = JSON.parse(rawBody);
    }
  } catch (error) {
    const params = new URLSearchParams(rawBody);
    if ([...params.keys()].length === 0) {
      console.error('Unable to parse Intouch webhook payload:', error);
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }
    params.forEach((value, key) => {
      parsedBody[key] = value;
    });
  }

  console.log('[Intouch] Received POST callback:', parsedBody);

  // Use shared processing logic
  return processIntouchCallback(parsedBody);
}

// Handle GET requests - Intouch sends callbacks as GET with query params
export async function GET(request: NextRequest) {
  // Log all incoming headers for diagnostics
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = key.toLowerCase().includes('auth') || key.toLowerCase().includes('signature') 
      ? '***REDACTED***' 
      : value;
  });
  console.log('[Intouch Callback] GET request received');
  console.log('[Intouch Callback] Headers:', JSON.stringify(headers, null, 2));

  const { searchParams } = new URL(request.url);
  console.log('[Intouch Callback] Query params:', Object.fromEntries(searchParams.entries()));
  
  // Check if this is a webhook verification challenge
  const challenge = searchParams.get('challenge');
  if (challenge) {
    console.log('[Intouch Callback] Webhook verification challenge received');
    return NextResponse.json({ challenge });
  }

  // Verify Basic Authentication (InTouch API requirement)
  const basicAuthUsername = process.env.INTOUCH_BASIC_AUTH_USERNAME;
  const basicAuthPassword = process.env.INTOUCH_BASIC_AUTH_PASSWORD;
  const allowUnsigned = process.env.INTOUCH_ALLOW_UNSIGNED_CALLBACKS === 'true';

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    console.log('[Intouch Callback] Authorization header present:', authHeader.split(' ')[0]);
    
    if (authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      
      console.log('[Intouch Callback] Basic Auth - Username received:', username);
      
      // Verify credentials if configured
      if (basicAuthUsername && basicAuthPassword) {
        if (username !== basicAuthUsername || password !== basicAuthPassword) {
          console.error('[Intouch Callback] Basic Auth verification FAILED');
          return NextResponse.json(
            { error: 'Invalid authentication credentials' },
            { status: 401 },
          );
        }
        console.log('[Intouch Callback] Basic Auth verification PASSED');
      } else {
        console.warn('[Intouch Callback] Basic Auth credentials not configured, skipping verification');
      }
    }
  } else {
    console.warn('[Intouch Callback] No Authorization header present');
  }

  // Check if this is an Intouch callback (they send as GET with query params)
  const paymentToken = searchParams.get('payment_token');
  const commandNumber = searchParams.get('command_number');
  const paymentStatus = searchParams.get('payment_status');
  
  if (paymentToken && commandNumber && paymentStatus) {
    // Convert query params to body format and process
    const callbackData: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      callbackData[key] = value;
    });

    console.log('[Intouch Callback] Processing GET callback with data:', callbackData);

    // Process the callback data using the same logic as POST
    return processIntouchCallback(callbackData);
  }

  console.log('[Intouch Callback] Health check - endpoint is active');
  return NextResponse.json({ status: 'Intouch webhook endpoint active' });
}

// Shared callback processing logic
async function processIntouchCallback(parsedBody: Record<string, unknown>) {
  console.log('[Intouch Callback] Processing callback data...');
  
  const transactionId = coerceString(pickFirst(parsedBody, TRANSACTION_ID_KEYS));
  const statusRawCandidate = coerceString(pickFirst(parsedBody, STATUS_KEYS));
  const amountRaw = pickFirst(parsedBody, AMOUNT_KEYS);
  const referenceNumber = coerceString(pickFirst(parsedBody, REFERENCE_KEYS));
  const paymentMethod = coerceString(pickFirst(parsedBody, PAYMENT_METHOD_KEYS));
  const timestampRaw = coerceString(pickFirst(parsedBody, TIMESTAMP_KEYS));
  const customerInfoRaw = pickFirst(parsedBody, CUSTOMER_INFO_KEYS);
  const statusFallback = coerceString(
    pickFirst(parsedBody, ['success', 'is_success', 'isSuccess', 'payment_status', 'paymentStatus'])
  );

  const statusRaw =
    statusRawCandidate && statusRawCandidate.trim().length > 0
      ? statusRawCandidate
      : statusFallback;

  console.log('[Intouch Callback] Extracted fields:', {
    transactionId,
    statusRaw,
    amount: amountRaw,
    referenceNumber,
    paymentMethod,
    timestamp: timestampRaw,
  });

  if (!transactionId || !statusRaw || !amountRaw || !referenceNumber) {
    console.error('[Intouch Callback] Missing required fields:', {
      hasTransactionId: !!transactionId,
      hasStatus: !!statusRaw,
      hasAmount: !!amountRaw,
      hasReferenceNumber: !!referenceNumber,
    });
    return NextResponse.json(
      { error: 'Missing required fields (transactionId, status, amount, referenceNumber)' },
      { status: 400 },
    );
  }

  const normalizedStatus = statusRaw.toString().trim().toLowerCase();
  let mappedStatus = CALLBACK_STATUS_MAPPING[normalizedStatus];

  if (!mappedStatus) {
    if (/^\d+$/.test(normalizedStatus)) {
      // Intouch uses 200 for success
      if (['0', '00', '200'].includes(normalizedStatus)) {
        mappedStatus = 'COMPLETED';
      } else if (normalizedStatus.startsWith('1') || normalizedStatus.startsWith('2')) {
        mappedStatus = 'PENDING';
      } else if (normalizedStatus === '420') {
        // Intouch uses 420 for failure
        mappedStatus = 'FAILED';
      } else {
        mappedStatus = 'FAILED';
      }
    } else if (normalizedStatus.startsWith('success') || normalizedStatus === 'ok') {
      mappedStatus = 'COMPLETED';
    } else if (
      normalizedStatus.includes('pending') ||
      normalizedStatus === 'processing' ||
      normalizedStatus.includes('progress')
    ) {
      mappedStatus = 'PENDING';
    } else if (normalizedStatus.includes('cancel')) {
      mappedStatus = 'CANCELLED';
    } else if (
      normalizedStatus.includes('fail') ||
      normalizedStatus.includes('error') ||
      normalizedStatus.includes('decline')
    ) {
      mappedStatus = 'FAILED';
    }
  }

  console.log('[Intouch Callback] Status mapping:', {
    rawStatus: statusRaw,
    normalizedStatus,
    mappedStatus,
  });

  if (!mappedStatus) {
    console.error('[Intouch Callback] Unknown status received:', statusRaw, 'Full payload:', parsedBody);
    return NextResponse.json(
      { error: `Unsupported payment status: ${statusRaw}` },
      { status: 400 },
    );
  }

  const callbackAmountDecimal = parseAmount(amountRaw);
  if (!callbackAmountDecimal) {
    console.error('[Intouch Callback] Invalid amount format:', amountRaw);
    return NextResponse.json({ error: 'Invalid amount format' }, { status: 400 });
  }

  console.log('[Intouch Callback] Looking up transaction intent with reference:', referenceNumber);

  const intent = await prisma.transactionIntent.findUnique({
    where: { referenceNumber: String(referenceNumber) },
    include: {
      user: true,
      account: true,
    },
  });

  if (!intent) {
    console.error('[Intouch Callback] Transaction intent NOT FOUND for reference:', referenceNumber);
    console.error('[Intouch Callback] Full callback payload:', parsedBody);
    return NextResponse.json({ error: 'Transaction intent not found' }, { status: 404 });
  }

  console.log('[Intouch Callback] Transaction intent found:', {
    intentId: intent.id,
    currentStatus: intent.status,
    amount: intent.amount.toString(),
    userId: intent.userId,
    accountId: intent.accountId,
  });

  if (intent.providerTransactionId && intent.providerTransactionId !== String(transactionId)) {
    console.error('Conflict: callback transaction ID does not match existing provider transaction ID', {
      existingProviderTransactionId: intent.providerTransactionId,
      incomingTransactionId: transactionId,
      referenceNumber,
    });
    return NextResponse.json(
      {
        error: 'Transaction already linked to a different provider transaction ID',
        providerTransactionId: intent.providerTransactionId,
      },
      { status: 409 },
    );
  }

  if (!intent.amount.equals(callbackAmountDecimal)) {
    console.error('Amount mismatch between intent and callback', {
      intentAmount: intent.amount.toString(),
      callbackAmount: callbackAmountDecimal.toString(),
      reference: referenceNumber,
    });
    return NextResponse.json(
      {
        error: 'Callback amount does not match transaction intent amount',
        intentAmount: intent.amount.toString(),
        callbackAmount: callbackAmountDecimal.toString(),
      },
      { status: 400 },
    );
  }

  const providerTransactionId = String(transactionId);
  const callbackTimestamp = timestampRaw ? new Date(Number(timestampRaw)) : new Date();
  const customerInfo = parseCustomerInfo(customerInfoRaw);

  try {
    const transactionResult = await prisma.$transaction(async (tx) => {
      const currentIntent = await tx.transactionIntent.findUnique({
        where: { id: intent.id },
        include: { account: true, user: true },
      });

      if (!currentIntent) {
        throw new Error('INTENT_NOT_FOUND');
      }

      if (!currentIntent.amount.equals(callbackAmountDecimal)) {
        throw new Error('AMOUNT_MISMATCH');
      }

      const currentBalance = new Prisma.Decimal(currentIntent.account.balance);
      const transactionAmount = new Prisma.Decimal(currentIntent.amount);

      let finalStatus: CallbackStatus = mappedStatus;
      let failureReason: string | null = null;
      let shouldUpdateBalance = false;

      if (mappedStatus === 'COMPLETED') {
        if (currentIntent.intentType === 'WITHDRAWAL') {
          if (currentBalance.lt(transactionAmount)) {
            finalStatus = 'FAILED';
            failureReason = 'Insufficient funds for withdrawal';
          } else if (currentIntent.status !== 'COMPLETED') {
            shouldUpdateBalance = true;
          }
        } else if (currentIntent.status !== 'COMPLETED') {
          shouldUpdateBalance = true;
        }
      }

      const statusChangedToCompleted = currentIntent.status !== 'COMPLETED' && finalStatus === 'COMPLETED';

      const adminNote = appendAdminNote(
        currentIntent.adminNotes,
        `Intouch callback ${String(statusRaw)} (${providerTransactionId}) at ${callbackTimestamp.toISOString()}`,
      );

      const updateData: Prisma.TransactionIntentUpdateInput = {
        providerStatus: String(statusRaw),
        lastCallbackAt: callbackTimestamp,
        lastCallbackPayload: toJsonValue(parsedBody),
        adminNotes: adminNote,
      };

      if (!currentIntent.providerTransactionId) {
        updateData.providerTransactionId = providerTransactionId;
      }

      if (currentIntent.status !== finalStatus) {
        updateData.status = finalStatus;
      }

      const updatedIntent = await tx.transactionIntent.update({
        where: { id: currentIntent.id },
        data: updateData,
        include: { account: true, user: true },
      });

      await tx.paymentCallbackLog.create({
        data: {
          transactionIntentId: updatedIntent.id,
          status: String(statusRaw),
          payload: toJsonValue(parsedBody),
        },
      });

      if (shouldUpdateBalance && finalStatus === 'COMPLETED') {
        const newBalance =
          currentIntent.intentType === 'WITHDRAWAL'
            ? currentBalance.sub(transactionAmount)
            : currentBalance.add(transactionAmount);

        await tx.userAccount.update({
          where: { id: updatedIntent.accountId },
          data: { balance: newBalance },
        });

        updatedIntent.account.balance = newBalance;
      }

      return {
        updatedIntent,
        finalStatus,
        failureReason,
        statusChangedToCompleted,
      };
    });

    const { updatedIntent, finalStatus, failureReason, statusChangedToCompleted } = transactionResult;

    console.log('[Intouch Callback] Transaction processing completed:', {
      intentId: updatedIntent.id,
      oldStatus: intent.status,
      newStatus: finalStatus,
      statusChangedToCompleted,
      failureReason,
    });

    if (statusChangedToCompleted) {
      console.log('[Intouch Callback] Sending email notification for completed transaction');
      await sendTransactionIntentEmail(
        updatedIntent.user.email,
        `${updatedIntent.user.firstName} ${updatedIntent.user.lastName}`,
        {
          type: updatedIntent.intentType.toLowerCase() as 'deposit' | 'investment' | 'withdrawal',
          amount: Number(updatedIntent.amount),
          paymentMethod: paymentMethod || 'Intouch',
          referenceNumber: updatedIntent.referenceNumber,
          accountType: updatedIntent.accountType.toLowerCase() as 'sama_naffa' | 'ape_investment',
          investmentTranche: updatedIntent.investmentTranche || undefined,
          investmentTerm: updatedIntent.investmentTerm || undefined,
          userNotes: updatedIntent.userNotes || undefined,
        },
      );
    }

    const responsePayload: Record<string, unknown> = {
      success: finalStatus === 'COMPLETED',
      transactionId: updatedIntent.id,
      status: finalStatus,
      providerTransactionId,
      message:
        finalStatus === 'COMPLETED'
          ? 'Transaction completed successfully'
          : `Transaction ${finalStatus.toLowerCase()}`,
    };

    if (failureReason) {
      responsePayload.failureReason = failureReason;
    }

    if (customerInfo) {
      responsePayload.customer = customerInfo;
    }

    // Return 200 for success, 420 for failure (as per Intouch docs)
    const statusCode = finalStatus === 'COMPLETED' ? 200 : 420;
    console.log('[Intouch Callback] Returning response:', {
      statusCode,
      finalStatus,
      transactionId: updatedIntent.id,
    });
    return NextResponse.json(responsePayload, { status: statusCode });
  } catch (error) {
    console.error('[Intouch Callback] ERROR during processing:', error);

    const failureMessage = error instanceof Error ? error.message : 'Internal server error';

    if (failureMessage === 'INTENT_NOT_FOUND') {
      return NextResponse.json({ error: 'Transaction intent not found' }, { status: 404 });
    }

    if (failureMessage === 'AMOUNT_MISMATCH') {
      return NextResponse.json(
        { error: 'Amount mismatch detected during processing' },
        { status: 400 },
      );
    }

    if (failureMessage === 'Insufficient funds for withdrawal') {
      return NextResponse.json(
        { error: 'Insufficient funds for withdrawal', status: 'FAILED' },
        { status: 420 },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
