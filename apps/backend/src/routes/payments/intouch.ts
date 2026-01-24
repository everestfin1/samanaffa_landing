import { Hono } from 'hono'
import crypto from 'crypto'
import { db, eq } from '../../lib/db.js'
import { apeSubscriptions, transactionIntents, userAccounts } from '../../lib/schema.js'

const INTOUCH_WEBHOOK_SECRET = process.env.INTOUCH_WEBHOOK_SECRET || ''

const app = new Hono()

type CallbackStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

function mapProviderStatus(status: unknown): CallbackStatus {
  const raw = String(status ?? '').trim().toLowerCase()

  if (raw === 'success' || raw === 'completed' || raw === 'paid' || raw === 'ok') return 'COMPLETED'
  if (raw === 'pending' || raw === 'processing' || raw === 'in_progress') return 'PENDING'
  if (raw === 'cancelled' || raw === 'canceled' || raw === 'aborted') return 'CANCELLED'
  if (raw === 'failed' || raw === 'error' || raw === 'declined' || raw === 'rejected') return 'FAILED'

  // Intouch sometimes uses numeric codes (200 = success, 420 = failure)
  if (/^\d+$/.test(raw)) {
    if (raw === '200' || raw === '0' || raw === '00') return 'COMPLETED'
    if (raw === '420') return 'FAILED'
    if (raw.startsWith('1') || raw.startsWith('2')) return 'PENDING'
    return 'FAILED'
  }

  return 'FAILED'
}

function toDecimalString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const num = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : Number(String(value))
  if (Number.isNaN(num)) return null
  return num.toFixed(2)
}

function parseBasicAuthHeader(authHeader: string | null): { username: string; password: string } | null {
  if (!authHeader) return null
  if (!authHeader.startsWith('Basic ')) return null
  const base64Credentials = authHeader.slice('Basic '.length)
  const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8')
  const index = decoded.indexOf(':')
  if (index === -1) return null
  return { username: decoded.slice(0, index), password: decoded.slice(index + 1) }
}

function verifyIntouchSignature(payload: string, signature: string): boolean {
  if (!INTOUCH_WEBHOOK_SECRET) {
    console.warn('INTOUCH_WEBHOOK_SECRET not configured, skipping signature verification')
    return true
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', INTOUCH_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

app.get('/config', async (c) => {
  try {
    const isTestEnvironment =
      process.env.NEXT_PUBLIC_APP_ENV === 'development' ||
      process.env.NEXT_PUBLIC_APP_ENV === 'test' ||
      process.env.VERCEL_ENV === 'development' ||
      process.env.VERCEL_ENV === 'preview' ||
      (!process.env.NEXT_PUBLIC_APP_ENV && process.env.NODE_ENV !== 'production')

    const apiKey = isTestEnvironment ? process.env.INTOUCH_TEST_API_KEY : process.env.INTOUCH_API_KEY
    const merchantId = isTestEnvironment ? process.env.INTOUCH_TEST_MERCHANT_ID : process.env.INTOUCH_MERCHANT_ID
    const domain = isTestEnvironment
      ? process.env.INTOUCH_TEST_DOMAIN || 'dev.samanaffa.com'
      : process.env.INTOUCH_DOMAIN || 'samanaffa.com'

    if (!apiKey) {
      const missingVar = isTestEnvironment ? 'INTOUCH_TEST_API_KEY' : 'INTOUCH_API_KEY'
      return c.json({ error: `Intouch API key not configured (${missingVar})` }, 500)
    }

    if (!merchantId) {
      const missingVar = isTestEnvironment ? 'INTOUCH_TEST_MERCHANT_ID' : 'INTOUCH_MERCHANT_ID'
      return c.json({ error: `Intouch merchant ID not configured (${missingVar})` }, 500)
    }

    return c.json({
      apiKey,
      merchantId,
      domain,
      environment: isTestEnvironment ? 'test' : 'production',
    })
  } catch (error) {
    console.error('Error fetching Intouch config:', error)
    return c.json({ error: 'Failed to fetch Intouch configuration' }, 500)
  }
})

app.post('/manual-callback', async (c) => {
  try {
    const body = await c.req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return c.json({ error: 'Invalid payload' }, 400)
    }

    const referenceNumber = String((body as any).referenceNumber ?? '').trim()
    const errorCode = (body as any).errorCode
    const providerTransactionId = (body as any).num_transaction_from_gu
    const callbackAmount = (body as any).amount

    if (!referenceNumber) {
      return c.json({ error: 'Missing referenceNumber' }, 400)
    }

    if (errorCode === undefined || errorCode === null) {
      return c.json({ error: 'Missing errorCode' }, 400)
    }

    const mappedStatus = mapProviderStatus(errorCode)

    const [intent] = await db
      .select()
      .from(transactionIntents)
      .where(eq(transactionIntents.referenceNumber, referenceNumber))
      .limit(1)

    if (!intent) {
      return c.json({ error: 'Transaction intent not found' }, 404)
    }

    if (intent.status === 'COMPLETED') {
      return c.json({
        success: true,
        message: 'Transaction already processed',
        status: 'COMPLETED',
        transactionId: intent.id,
      })
    }

    if (callbackAmount !== undefined && callbackAmount !== null && String(callbackAmount).trim().length > 0) {
      const expected = Number(intent.amount)
      const received = Number(callbackAmount)
      if (!Number.isFinite(received) || expected !== received) {
        return c.json({ error: 'Amount mismatch', expected, received }, 400)
      }
    }

    const [account] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.id, intent.accountId))
      .limit(1)

    const currentBalance = account ? Number(account.balance) : 0
    const transactionAmount = Number(intent.amount)

    let finalStatus: CallbackStatus = mappedStatus
    let shouldUpdateBalance = false

    if (mappedStatus === 'COMPLETED') {
      if (intent.intentType === 'WITHDRAWAL') {
        if (currentBalance < transactionAmount) {
          finalStatus = 'FAILED'
        } else {
          shouldUpdateBalance = true
        }
      } else {
        shouldUpdateBalance = true
      }
    }

    await db
      .update(transactionIntents)
      .set({
        status: finalStatus,
        providerStatus: String(errorCode),
        providerTransactionId: intent.providerTransactionId || (providerTransactionId ? String(providerTransactionId) : null),
        updatedAt: new Date(),
      })
      .where(eq(transactionIntents.id, intent.id))

    if (shouldUpdateBalance && account) {
      const newBalance =
        intent.intentType === 'WITHDRAWAL'
          ? (currentBalance - transactionAmount).toFixed(2)
          : (currentBalance + transactionAmount).toFixed(2)

      await db
        .update(userAccounts)
        .set({ balance: newBalance })
        .where(eq(userAccounts.id, account.id))
    }

    return c.json({
      success: finalStatus === 'COMPLETED',
      transactionId: intent.id,
      status: finalStatus,
      providerTransactionId: providerTransactionId ? String(providerTransactionId) : intent.providerTransactionId,
    })
  } catch (error) {
    console.error('Manual callback error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// POST /payments/intouch/callback
// Simple flow: verify signature → update DB → return 200
app.post('/callback', async (c) => {
  try {
    const rawBody = await c.req.text()
    const signature = c.req.header('x-intouch-signature') || ''
    const allowUnsigned = process.env.INTOUCH_ALLOW_UNSIGNED_CALLBACKS === 'true'

    // Optional basic auth guard (when configured)
    const auth = parseBasicAuthHeader(c.req.header('authorization') ?? null)
    const basicAuthUsername =
      process.env.NODE_ENV === 'production'
        ? process.env.INTOUCH_BASIC_AUTH_USERNAME
        : process.env.INTOUCH_BASIC_AUTH_USERNAME_TEST
    const basicAuthPassword =
      process.env.NODE_ENV === 'production'
        ? process.env.INTOUCH_BASIC_AUTH_PASSWORD
        : process.env.INTOUCH_BASIC_AUTH_PASSWORD_TEST

    if (basicAuthUsername && basicAuthPassword) {
      if (!auth || auth.username !== basicAuthUsername || auth.password !== basicAuthPassword) {
        return c.json({ success: false, error: 'Invalid authentication credentials' }, 401)
      }
    }

    // Verify signature
    if (INTOUCH_WEBHOOK_SECRET && !verifyIntouchSignature(rawBody, signature)) {
      if (!allowUnsigned) {
        console.error('Invalid Intouch webhook signature')
        return c.json({ success: false, error: 'Invalid signature' }, 401)
      }
    }

    const contentType = c.req.header('content-type') || ''
    const payload: any = contentType.includes('application/x-www-form-urlencoded')
      ? Object.fromEntries(new URLSearchParams(rawBody).entries())
      : JSON.parse(rawBody)

    const transactionId = payload.transactionId || payload.transaction_id || payload.id || payload.payment_token
    const referenceNumber =
      payload.referenceNumber ||
      payload.reference ||
      payload.command_number ||
      payload.num_command ||
      payload.order_number
    const providerStatus = payload.providerStatus || payload.payment_status || payload.status || payload.code || payload.errorCode
    const amount = payload.paid_amount || payload.amount || payload.montant
    const providerTransactionId =
      payload.providerTransactionId || payload.num_transaction_from_gu || payload.transactionReference || payload.payment_token

    if (!referenceNumber && !transactionId) {
      return c.json({ success: false, error: 'Missing reference' }, 400)
    }

    // Try to find APE subscription first
    if (referenceNumber) {
      const apeResults = await db.select()
        .from(apeSubscriptions)
        .where(eq(apeSubscriptions.referenceNumber, referenceNumber))
        .limit(1)

      if (apeResults[0]) {
        const subscription = apeResults[0]
        
        // Idempotency: skip if already completed
        if (subscription.status === 'PAYMENT_SUCCESS') {
          return c.json({ success: true, message: 'Already processed' })
        }

        const newStatus = mapProviderStatus(providerStatus) === 'COMPLETED'
          ? 'PAYMENT_SUCCESS'
          : mapProviderStatus(providerStatus) === 'FAILED'
            ? 'PAYMENT_FAILED'
            : 'PAYMENT_INITIATED'

        await db.update(apeSubscriptions)
          .set({
            status: newStatus,
            providerTransactionId: providerTransactionId ? String(providerTransactionId) : null,
            providerStatus: providerStatus ? String(providerStatus) : null,
            paymentCallbackPayload: payload,
            paymentCompletedAt: newStatus === 'PAYMENT_SUCCESS' ? new Date() : null,
            updatedAt: new Date()
          })
          .where(eq(apeSubscriptions.id, subscription.id))

        return c.json({ success: true, message: 'Subscription updated' })
      }
    }

    // Try transaction intents
    if (transactionId || referenceNumber) {
      const intentResults = await db.select()
        .from(transactionIntents)
        .where(
          referenceNumber 
            ? eq(transactionIntents.referenceNumber, referenceNumber)
            : eq(transactionIntents.id, transactionId)
        )
        .limit(1)

      if (intentResults[0]) {
        const intent = intentResults[0]
        
        // Idempotency
        if (intent.status === 'COMPLETED') {
          return c.json({ success: true, message: 'Already processed' })
        }

        const mapped = mapProviderStatus(providerStatus)
        const callbackAmount = toDecimalString(amount)
        const expectedAmount = toDecimalString(intent.amount)

        if (callbackAmount && expectedAmount && Number(callbackAmount) !== Number(expectedAmount)) {
          console.error('Amount mismatch between intent and callback', {
            intentAmount: expectedAmount,
            callbackAmount,
            referenceNumber,
          })
          return c.json({ success: false, error: 'Amount mismatch' }, 400)
        }

        const [account] = await db
          .select()
          .from(userAccounts)
          .where(eq(userAccounts.id, intent.accountId))
          .limit(1)

        const currentBalance = account ? Number(account.balance) : 0
        const transactionAmount = Number(intent.amount)
        let finalStatus: CallbackStatus = mapped
        let shouldUpdateBalance = false

        if (mapped === 'COMPLETED') {
          if (intent.intentType === 'WITHDRAWAL') {
            if (currentBalance < transactionAmount) {
              finalStatus = 'FAILED'
            } else {
              shouldUpdateBalance = true
            }
          } else {
            shouldUpdateBalance = true
          }
        }

        await db.update(transactionIntents)
          .set({
            status: finalStatus,
            providerTransactionId: providerTransactionId ? String(providerTransactionId) : intent.providerTransactionId,
            providerStatus: providerStatus ? String(providerStatus) : null,
            updatedAt: new Date()
          })
          .where(eq(transactionIntents.id, intent.id))

        if (shouldUpdateBalance && account) {
          const newBalance =
            intent.intentType === 'WITHDRAWAL'
              ? (currentBalance - transactionAmount).toFixed(2)
              : (currentBalance + transactionAmount).toFixed(2)

          await db.update(userAccounts)
            .set({ balance: newBalance })
            .where(eq(userAccounts.id, account.id))
        }

        return c.json({ success: true, message: 'Transaction updated' })
      }
    }

    console.warn('Intouch callback: No matching record found', { referenceNumber, transactionId })
    return c.json({ success: true, message: 'No matching record' })

  } catch (error) {
    console.error('Intouch callback error:', error)
    // Return 200 to prevent retries for parsing errors
    return c.json({ success: false, error: 'Processing error' }, 200)
  }
})

app.get('/callback', async (c) => {
  try {
    const query = c.req.query()

    const payload = { ...query }
    if (Object.keys(payload).length === 0) {
      return c.json({ status: 'Intouch webhook endpoint active' })
    }

    // Reuse same logic: shape query into the POST handler format
    const referenceNumber = query.command_number || query.referenceNumber || query.reference
    const transactionId = query.payment_token || query.transactionId || query.id
    const providerStatus = query.payment_status || query.status || query.code

    const fakeBody = JSON.stringify({
      referenceNumber,
      transactionId,
      providerStatus,
      providerTransactionId: query.num_transaction_from_gu || query.transactionReference,
      amount: query.paid_amount || query.amount,
      ...query,
    })

    // Minimal inline handling: execute the same update logic by parsing fakeBody
    const signature = c.req.header('x-intouch-signature') || ''
    if (INTOUCH_WEBHOOK_SECRET && !verifyIntouchSignature(fakeBody, signature)) {
      const allowUnsigned = process.env.INTOUCH_ALLOW_UNSIGNED_CALLBACKS === 'true'
      if (!allowUnsigned) {
        return c.json({ success: false, error: 'Invalid signature' }, 401)
      }
    }

    // Avoid duplicating code too heavily: call the POST handler logic by inlining the core operations
    const parsedPayload = JSON.parse(fakeBody)
    const resolvedReference = parsedPayload.referenceNumber
    const resolvedTransactionId = parsedPayload.transactionId

    if (!resolvedReference && !resolvedTransactionId) {
      return c.json({ success: false, error: 'Missing reference' }, 400)
    }

    // Try APE subscription first
    if (resolvedReference) {
      const apeResults = await db.select()
        .from(apeSubscriptions)
        .where(eq(apeSubscriptions.referenceNumber, resolvedReference))
        .limit(1)

      if (apeResults[0]) {
        const subscription = apeResults[0]
        if (subscription.status === 'PAYMENT_SUCCESS') {
          return c.json({ success: true, message: 'Already processed' })
        }

        const mapped = mapProviderStatus(parsedPayload.providerStatus)
        const newStatus = mapped === 'COMPLETED'
          ? 'PAYMENT_SUCCESS'
          : mapped === 'FAILED'
            ? 'PAYMENT_FAILED'
            : 'PAYMENT_INITIATED'

        await db.update(apeSubscriptions)
          .set({
            status: newStatus,
            providerTransactionId: parsedPayload.providerTransactionId ? String(parsedPayload.providerTransactionId) : null,
            providerStatus: parsedPayload.providerStatus ? String(parsedPayload.providerStatus) : null,
            paymentCallbackPayload: parsedPayload,
            paymentCompletedAt: newStatus === 'PAYMENT_SUCCESS' ? new Date() : null,
            updatedAt: new Date()
          })
          .where(eq(apeSubscriptions.id, subscription.id))

        return c.json({ success: true, message: 'Subscription updated' })
      }
    }

    // Transaction intents
    const intentResults = await db.select()
      .from(transactionIntents)
      .where(
        resolvedReference
          ? eq(transactionIntents.referenceNumber, resolvedReference)
          : eq(transactionIntents.id, resolvedTransactionId)
      )
      .limit(1)

    const intent = intentResults[0]
    if (!intent) {
      return c.json({ success: true, message: 'No matching record' })
    }

    if (intent.status === 'COMPLETED') {
      return c.json({ success: true, message: 'Already processed' })
    }

    const mapped = mapProviderStatus(parsedPayload.providerStatus)
    const [account] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.id, intent.accountId))
      .limit(1)

    const currentBalance = account ? Number(account.balance) : 0
    const transactionAmount = Number(intent.amount)
    let finalStatus: CallbackStatus = mapped
    let shouldUpdateBalance = false

    if (mapped === 'COMPLETED') {
      if (intent.intentType === 'WITHDRAWAL') {
        if (currentBalance < transactionAmount) {
          finalStatus = 'FAILED'
        } else {
          shouldUpdateBalance = true
        }
      } else {
        shouldUpdateBalance = true
      }
    }

    await db.update(transactionIntents)
      .set({
        status: finalStatus,
        providerTransactionId: parsedPayload.providerTransactionId ? String(parsedPayload.providerTransactionId) : intent.providerTransactionId,
        providerStatus: parsedPayload.providerStatus ? String(parsedPayload.providerStatus) : null,
        updatedAt: new Date()
      })
      .where(eq(transactionIntents.id, intent.id))

    if (shouldUpdateBalance && account) {
      const newBalance =
        intent.intentType === 'WITHDRAWAL'
          ? (currentBalance - transactionAmount).toFixed(2)
          : (currentBalance + transactionAmount).toFixed(2)

      await db.update(userAccounts)
        .set({ balance: newBalance })
        .where(eq(userAccounts.id, account.id))
    }

    return c.json({ success: true, message: 'Transaction updated' })
  } catch (error) {
    console.error('Intouch callback GET error:', error)
    return c.json({ success: false, error: 'Processing error' }, 200)
  }
})

export default app
