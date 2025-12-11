import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
// Prisma types no longer needed with Drizzle
import { prisma } from '@/lib/prisma';
import { db } from '@/lib/db';
import { apeSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendTransactionIntentEmail } from '@/lib/notifications';

// Payment request validation middleware
function validatePaymentRequest(request: NextRequest, body: Record<string, unknown>): { isValid: boolean; error?: string } {
  try {
    // Check for required headers
    const userAgent = request.headers.get('user-agent');
    const contentType = request.headers.get('content-type');

    // Basic request validation
    if (!userAgent) {
      return { isValid: false, error: 'Missing User-Agent header' };
    }

    // Validate content type for POST requests
    if (request.method === 'POST' && !contentType) {
      return { isValid: false, error: 'Missing Content-Type header' };
    }

    // Check for suspicious patterns in request data
    const suspiciousPatterns = [
      /<script/i, /javascript:/i, /onload=/i, /onerror=/i,
      /eval\(/i, /document\./i, /window\./i
    ];

    const bodyString = JSON.stringify(body);
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(bodyString)) {
        console.warn('[Payment Security] Suspicious pattern detected in request body');
        return { isValid: false, error: 'Invalid request data' };
      }
    }

    // Validate request size (prevent oversized payloads)
    const maxPayloadSize = Number(process.env.PAYMENT_MAX_PAYLOAD_SIZE || '10240'); // Default: 10KB
    if (bodyString.length > maxPayloadSize) {
      console.warn(`[Payment Security] Payload size ${bodyString.length} exceeds limit ${maxPayloadSize}`);
      return { isValid: false, error: 'Request payload too large' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('[Payment Security] Request validation error:', error);
    return { isValid: false, error: 'Request validation failed' };
  }
}

// Payment security utilities
class PaymentSecurity {
private static idempotencyStore = new Map<string, { timestamp: number; data: any }>();
private static readonly IDEMPOTENCY_TTL = Number(process.env.PAYMENT_IDEMPOTENCY_TTL || '86400000'); // Default: 24 hours

  // Rate limiting for payment endpoints (configurable via environment)
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();
  private static readonly RATE_LIMIT_WINDOW = Number(process.env.PAYMENT_RATE_LIMIT_WINDOW || '900000'); // Default: 15 minutes
  private static readonly RATE_LIMIT_MAX_REQUESTS = Number(process.env.PAYMENT_RATE_LIMIT_MAX_REQUESTS || '10'); // Default: 10 requests

  static generateIdempotencyKey(): string {
    return randomBytes(16).toString('hex');
  }

  static validateIdempotencyKey(key: string, data: any): boolean {
    if (!key || typeof key !== 'string') return false;

    const existing = this.idempotencyStore.get(key);
    if (existing) {
      // Check if data matches (prevent replay with different data)
      const dataMatches = JSON.stringify(existing.data) === JSON.stringify(data);
      if (!dataMatches) {
        console.warn('[Payment Security] Idempotency key used with different data:', key);
        return false;
      }
      return true; // Allow same request
    }

    // Store new idempotency key
    this.idempotencyStore.set(key, {
      timestamp: Date.now(),
      data: JSON.parse(JSON.stringify(data)) // Deep clone
    });

    // Clean up expired keys
    this.cleanupExpiredKeys();

    return true;
  }

  static checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const existing = this.rateLimitStore.get(identifier);

    if (!existing || now > existing.resetTime) {
      // First request or window expired
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      });
      return true;
    }

    if (existing.count >= this.RATE_LIMIT_MAX_REQUESTS) {
      console.warn(`[Payment Security] Rate limit exceeded for ${identifier}`);
      return false;
    }

    existing.count++;
    return true;
  }

  private static cleanupExpiredKeys(): void {
    const now = Date.now();
    for (const [key, value] of this.idempotencyStore.entries()) {
      if (now - value.timestamp > this.IDEMPOTENCY_TTL) {
        this.idempotencyStore.delete(key);
      }
    }

    // Also cleanup rate limit entries
    for (const [key, value] of this.rateLimitStore.entries()) {
      if (now > value.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }

  static secureLogPaymentData(data: any, operation: string): void {
    // Create sanitized version for logging
    const sanitized = { ...data };

    // Encrypt sensitive fields
    const sensitiveFields = [
      'cardNumber', 'cvv', 'pin', 'password', 'token',
      'authorization', 'signature', 'secret', 'key',
      'card_number', 'cardNumber', 'cvv2', 'expiry', 'cardholder_name'
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***ENCRYPTED***';
      }
    });

    // Log sanitized data
    console.log(`[Payment Security] ${operation}:`, JSON.stringify(sanitized, null, 2));
  }

  static validatePaymentAmount(amount: string | number, reference: string): boolean {
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

      // Get configurable limits from environment variables
      const maxAmount = Number(process.env.PAYMENT_MAX_AMOUNT || '10000000'); // Default: 10M CFA
      const minAmount = Number(process.env.PAYMENT_MIN_AMOUNT || '100');      // Default: 100 CFA

      // Basic validation rules
      if (isNaN(numAmount) || numAmount <= 0) {
        console.error(`[Payment Security] Invalid amount for ${reference}:`, amount);
        return false;
      }

      // Check for suspicious amounts (too large)
      if (numAmount > maxAmount) {
        console.warn(`[Payment Security] Amount exceeds maximum (${maxAmount}) for ${reference}:`, numAmount);
        return false;
      }

      // Check for suspicious amounts (too small)
      if (numAmount < minAmount) {
        console.warn(`[Payment Security] Amount below minimum (${minAmount}) for ${reference}:`, numAmount);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`[Payment Security] Amount validation error for ${reference}:`, error);
      return false;
    }
  }

  static validateReferenceNumber(reference: string): boolean {
    // Validate reference number format
    const referenceRegex = /^[A-Z0-9\-_]+$/;
    if (!referenceRegex.test(reference)) {
      console.error('[Payment Security] Invalid reference number format:', reference);
      return false;
    }

    // Check length constraints
    if (reference.length < 5 || reference.length > 100) {
      console.error('[Payment Security] Reference number length out of bounds:', reference.length);
      return false;
    }

    return true;
  }
}

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

function parseAmount(amount: unknown): string | null {
  try {
    if (amount === null || amount === undefined) return null;
    if (typeof amount === 'string') {
      if (amount.trim().length === 0) return null;
      return parseFloat(amount).toFixed(2);
    }
    if (typeof amount === 'number') return amount.toFixed(2);
    return String(amount);
  } catch {
    return null;
  }
}

function toJsonValue(payload: unknown): any {
  return payload;
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

function parseCustomerInfo(value: unknown): any | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientIP = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown';
  if (!PaymentSecurity.checkRateLimit(`callback_post_${clientIP}`)) {
    console.warn('[Intouch Callback] Rate limit exceeded for IP:', clientIP);
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 },
    );
  }

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

  // Validate payment request
  const validation = validatePaymentRequest(request, parsedBody);
  if (!validation.isValid) {
    console.error('[Intouch Callback] Request validation failed:', validation.error);
    return NextResponse.json(
      { error: validation.error },
      { status: 400 },
    );
  }

  console.log('[Intouch] Received POST callback:', parsedBody);

  // Use shared processing logic
  return processIntouchCallback(parsedBody);
}

// Handle GET requests - Intouch sends callbacks as GET with query params
export async function GET(request: NextRequest) {
  // Rate limiting check
  const clientIP = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown';
  if (!PaymentSecurity.checkRateLimit(`callback_get_${clientIP}`)) {
    console.warn('[Intouch Callback] Rate limit exceeded for IP:', clientIP);
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 },
    );
  }

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

  // Secure logging of payment data
  PaymentSecurity.secureLogPaymentData(parsedBody, 'Callback Received');

  const transactionId = coerceString(pickFirst(parsedBody, TRANSACTION_ID_KEYS));
  const statusRawCandidate = coerceString(pickFirst(parsedBody, STATUS_KEYS));
  const amountRaw = pickFirst(parsedBody, AMOUNT_KEYS);
  const referenceNumber = coerceString(pickFirst(parsedBody, REFERENCE_KEYS));
  const paymentMethod = coerceString(pickFirst(parsedBody, PAYMENT_METHOD_KEYS));
  const timestampRaw = coerceString(pickFirst(parsedBody, TIMESTAMP_KEYS));
  const customerInfoRaw = pickFirst(parsedBody, CUSTOMER_INFO_KEYS);
  const idempotencyKey = coerceString(pickFirst(parsedBody, ['idempotencyKey', 'idempotency_key', 'idempotency']));
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
    idempotencyKey,
  });

  // Enhanced security validations
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

  // Validate reference number format
  if (!PaymentSecurity.validateReferenceNumber(referenceNumber)) {
    return NextResponse.json(
      { error: 'Invalid reference number format' },
      { status: 400 },
    );
  }

  // Validate payment amount
  const amountString = String(amountRaw);
  if (!PaymentSecurity.validatePaymentAmount(amountString, referenceNumber)) {
    return NextResponse.json(
      { error: 'Invalid payment amount' },
      { status: 400 },
    );
  }

  // Check idempotency key if provided
  if (idempotencyKey) {
    if (!PaymentSecurity.validateIdempotencyKey(idempotencyKey, parsedBody)) {
      console.warn('[Intouch Callback] Idempotency key validation failed:', idempotencyKey);
      return NextResponse.json(
        { error: 'Idempotency key validation failed' },
        { status: 409 },
      );
    }
    console.log('[Intouch Callback] Idempotency key validated:', idempotencyKey);
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

  // If no transactionIntent found, check if this is an APE subscription
  if (!intent) {
    console.log('[Intouch Callback] Transaction intent not found, checking APE subscriptions...');
    
    // Check APE subscriptions table
    const [apeSubscription] = await db
      .select()
      .from(apeSubscriptions)
      .where(eq(apeSubscriptions.referenceNumber, String(referenceNumber)))
      .limit(1);

    if (apeSubscription) {
      console.log('[Intouch Callback] Found APE subscription:', {
        id: apeSubscription.id,
        referenceNumber: apeSubscription.referenceNumber,
        currentStatus: apeSubscription.status,
        amount: apeSubscription.montantCfa,
      });

      // Process APE subscription callback
      return processApeSubscriptionCallback(
        apeSubscription,
        parsedBody,
        mappedStatus,
        transactionId,
        statusRaw,
        callbackAmountDecimal,
        paymentMethod,
        timestampRaw
      );
    }

    console.error('[Intouch Callback] Neither transaction intent nor APE subscription found for reference:', referenceNumber);
    console.error('[Intouch Callback] Full callback payload:', parsedBody);
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
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

  if (parseFloat(intent.amount) !== parseFloat(callbackAmountDecimal)) {
    console.error('Amount mismatch between intent and callback', {
      intentAmount: intent.amount,
      callbackAmount: callbackAmountDecimal,
      reference: referenceNumber,
    });
    return NextResponse.json(
      {
        error: 'Callback amount does not match transaction intent amount',
        intentAmount: intent.amount,
        callbackAmount: callbackAmountDecimal,
      },
      { status: 400 },
    );
  }

  const providerTransactionId = String(transactionId);
  const callbackTimestamp = timestampRaw ? new Date(Number(timestampRaw)) : new Date();
  const customerInfo = parseCustomerInfo(customerInfoRaw);

  try {
    const transactionResult = await prisma.$transaction(async (tx: any) => {
      const currentIntent = await tx.transactionIntent.findUnique({
        where: { id: intent.id },
        include: { account: true, user: true },
      });

      if (!currentIntent) {
        throw new Error('INTENT_NOT_FOUND');
      }

      if (parseFloat(currentIntent.amount) !== parseFloat(callbackAmountDecimal)) {
        throw new Error('AMOUNT_MISMATCH');
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

      const statusChangedToCompleted = currentIntent.status !== 'COMPLETED' && finalStatus === 'COMPLETED';

      const adminNote = appendAdminNote(
        currentIntent.adminNotes,
        `Intouch callback ${String(statusRaw)} (${providerTransactionId}) at ${callbackTimestamp.toISOString()}`,
      );

      const updateData: any = {
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
      });
      
      // Manually attach account and user since include doesn't work with Drizzle yet
      updatedIntent.account = currentIntent.account;
      updatedIntent.user = currentIntent.user;

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
            ? (currentBalance - transactionAmount).toFixed(2)
            : (currentBalance + transactionAmount).toFixed(2);

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

    // Return 200 for success OR pending states (Intouch needs 200 to continue sending updates)
    // Only return 420 for explicit failures (FAILED, CANCELLED)
    // Per Intouch docs: 200 = "transaction is initiated and validated in our system"
    //                   420 = "transaction failed on the system"
    const statusCode = (finalStatus === 'COMPLETED' || finalStatus === 'PENDING') ? 200 : 420;
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

// Process APE subscription callback
async function processApeSubscriptionCallback(
  apeSubscription: typeof apeSubscriptions.$inferSelect,
  parsedBody: Record<string, unknown>,
  mappedStatus: CallbackStatus,
  transactionId: string,
  statusRaw: string,
  callbackAmountDecimal: string,
  paymentMethod: string | null,
  timestampRaw: string | null
) {
  const providerTransactionId = String(transactionId);
  const callbackTimestamp = timestampRaw ? new Date(Number(timestampRaw)) : new Date();

  // Validate amount matches (APE stores amount as string)
  const subscriptionAmount = parseFloat(apeSubscription.montantCfa);
  const callbackAmount = parseFloat(callbackAmountDecimal);
  
  if (Math.abs(subscriptionAmount - callbackAmount) > 1) {
    console.error('[Intouch Callback] APE amount mismatch:', {
      subscriptionAmount,
      callbackAmount,
      referenceNumber: apeSubscription.referenceNumber,
    });
    return NextResponse.json(
      {
        error: 'Callback amount does not match subscription amount',
        subscriptionAmount,
        callbackAmount,
      },
      { status: 400 }
    );
  }

  // Check for duplicate provider transaction ID
  if (apeSubscription.providerTransactionId && apeSubscription.providerTransactionId !== providerTransactionId) {
    console.error('[Intouch Callback] APE provider transaction ID conflict:', {
      existingProviderTransactionId: apeSubscription.providerTransactionId,
      incomingTransactionId: providerTransactionId,
      referenceNumber: apeSubscription.referenceNumber,
    });
    return NextResponse.json(
      {
        error: 'Subscription already linked to a different provider transaction ID',
        providerTransactionId: apeSubscription.providerTransactionId,
      },
      { status: 409 }
    );
  }

  // Map callback status to APE subscription status
  type ApeStatus = 'PENDING' | 'PAYMENT_INITIATED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'CANCELLED';
  let apeStatus: ApeStatus;
  switch (mappedStatus) {
    case 'COMPLETED':
      apeStatus = 'PAYMENT_SUCCESS';
      break;
    case 'FAILED':
      apeStatus = 'PAYMENT_FAILED';
      break;
    case 'CANCELLED':
      apeStatus = 'CANCELLED';
      break;
    case 'PENDING':
    default:
      apeStatus = 'PAYMENT_INITIATED';
      break;
  }

  try {
    // Update APE subscription
    const [updatedSubscription] = await db
      .update(apeSubscriptions)
      .set({
        status: apeStatus,
        providerTransactionId: providerTransactionId,
        providerStatus: String(statusRaw),
        paymentCallbackPayload: parsedBody,
        paymentCompletedAt: apeStatus === 'PAYMENT_SUCCESS' || apeStatus === 'PAYMENT_FAILED' ? callbackTimestamp : null,
        updatedAt: new Date(),
      })
      .where(eq(apeSubscriptions.referenceNumber, apeSubscription.referenceNumber))
      .returning();

    console.log('[Intouch Callback] APE subscription updated:', {
      id: updatedSubscription.id,
      referenceNumber: updatedSubscription.referenceNumber,
      oldStatus: apeSubscription.status,
      newStatus: apeStatus,
      providerTransactionId,
    });

    // Send email notification for completed payments
    if (apeStatus === 'PAYMENT_SUCCESS' && apeSubscription.status !== 'PAYMENT_SUCCESS') {
      console.log('[Intouch Callback] Sending APE confirmation email to:', updatedSubscription.email);
      
      try {
        await sendTransactionIntentEmail(
          updatedSubscription.email,
          `${updatedSubscription.prenom} ${updatedSubscription.nom}`,
          {
            type: 'investment',
            amount: Number(updatedSubscription.montantCfa),
            paymentMethod: paymentMethod || 'Intouch',
            referenceNumber: updatedSubscription.referenceNumber,
            accountType: 'ape_investment',
            investmentTranche: updatedSubscription.trancheInteresse as 'A' | 'B' | 'C' | 'D' | undefined,
            userNotes: `APE Subscription - ${updatedSubscription.trancheInteresse}`,
          }
        );
        console.log('[Intouch Callback] APE confirmation email sent successfully');
      } catch (emailError) {
        console.error('[Intouch Callback] Failed to send APE confirmation email:', emailError);
        // Don't fail the callback if email fails
      }
    } else if (apeStatus === 'PAYMENT_FAILED' && apeSubscription.status !== 'PAYMENT_FAILED') {
      console.log('[Intouch Callback] APE payment failed for:', updatedSubscription.email);
      // TODO: Send failure notification email
    }

    const responsePayload: Record<string, unknown> = {
      success: apeStatus === 'PAYMENT_SUCCESS',
      subscriptionId: updatedSubscription.id,
      status: apeStatus,
      providerTransactionId,
      message:
        apeStatus === 'PAYMENT_SUCCESS'
          ? 'APE subscription payment completed successfully'
          : `APE subscription payment ${apeStatus.toLowerCase().replace('_', ' ')}`,
    };

    // Return 200 for success OR pending states (Intouch needs 200 to continue sending updates)
    // Only return 420 for explicit failures (FAILED, CANCELLED)
    // Per Intouch docs: 200 = "transaction is initiated and validated in our system"
    //                   420 = "transaction failed on the system"
    const statusCode = (apeStatus === 'PAYMENT_SUCCESS' || apeStatus === 'PAYMENT_INITIATED') ? 200 : 420;
    console.log('[Intouch Callback] APE callback response:', {
      statusCode,
      apeStatus,
      subscriptionId: updatedSubscription.id,
    });
    
    return NextResponse.json(responsePayload, { status: statusCode });
  } catch (error) {
    console.error('[Intouch Callback] Error processing APE subscription callback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
