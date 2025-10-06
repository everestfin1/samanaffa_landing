import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { Prisma } from '@prisma/client';
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
  'amount',
  'transactionAmount',
  'montant',
  'montant_total',
  'montantTTC',
  'totalAmount',
  'amount_total',
];
const PAYMENT_METHOD_KEYS = [
  'paymentMethod',
  'payment_method',
  'paymentChannel',
  'channel',
  'moyen_paiement',
];
const TIMESTAMP_KEYS = [
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
  const webhookSecret = process.env.INTOUCH_WEBHOOK_SECRET;
  const allowUnsigned = process.env.INTOUCH_ALLOW_UNSIGNED_CALLBACKS === 'true';

  if (!webhookSecret && !allowUnsigned) {
    console.error('Intouch webhook secret is not configured.');
    return NextResponse.json(
      { error: 'Webhook secret not configured on server' },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  if (!rawBody) {
    return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
  }

  const signature = getHeaderSignature(request);
  if (!signature) {
    if (!allowUnsigned) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 401 });
    }
    console.warn('[Intouch] Callback received without signature, processing due to allow flag.');
  } else if (!webhookSecret) {
    console.warn('[Intouch] Signature provided but webhook secret missing; skipping verification.');
  } else if (!verifySignature(rawBody, signature, webhookSecret)) {
    if (!allowUnsigned) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }
    console.warn('[Intouch] Signature verification failed, processing due to allow flag.');
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

  if (!transactionId || !statusRaw || !amountRaw || !referenceNumber) {
    return NextResponse.json(
      { error: 'Missing required fields (transactionId, status, amount, referenceNumber)' },
      { status: 400 },
    );
  }

  const normalizedStatus = statusRaw.toString().trim().toLowerCase();
  let mappedStatus = CALLBACK_STATUS_MAPPING[normalizedStatus];

  if (!mappedStatus) {
    if (/^\d+$/.test(normalizedStatus)) {
      if (['0', '00', '200'].includes(normalizedStatus)) {
        mappedStatus = 'COMPLETED';
      } else if (normalizedStatus.startsWith('1') || normalizedStatus.startsWith('2')) {
        mappedStatus = 'PENDING';
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

  if (!mappedStatus) {
    console.warn('Received unknown Intouch status:', statusRaw, parsedBody);
    return NextResponse.json(
      { error: `Unsupported payment status: ${statusRaw}` },
      { status: 400 },
    );
  }

  const callbackAmountDecimal = parseAmount(amountRaw);
  if (!callbackAmountDecimal) {
    return NextResponse.json({ error: 'Invalid amount format' }, { status: 400 });
  }

  const intent = await prisma.transactionIntent.findUnique({
    where: { referenceNumber: String(referenceNumber) },
    include: {
      user: true,
      account: true,
    },
  });

  if (!intent) {
    console.error('Transaction intent not found for reference:', referenceNumber, parsedBody);
    return NextResponse.json({ error: 'Transaction intent not found' }, { status: 404 });
  }

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
  const callbackTimestamp = timestampRaw ? new Date(String(timestampRaw)) : new Date();
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

    if (statusChangedToCompleted) {
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

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('Intouch callback processing error:', error);

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
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
