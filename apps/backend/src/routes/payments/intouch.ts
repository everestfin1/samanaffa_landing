import { Hono } from 'hono'
import crypto from 'crypto'
import { db, eq } from '../../lib/db.js'
import { apeSubscriptions, transactionIntents } from '../../lib/schema.js'

const INTOUCH_WEBHOOK_SECRET = process.env.INTOUCH_WEBHOOK_SECRET || ''

const app = new Hono()

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

// POST /payments/intouch/callback
// Simple flow: verify signature → update DB → return 200
app.post('/callback', async (c) => {
  try {
    const rawBody = await c.req.text()
    const signature = c.req.header('x-intouch-signature') || ''

    // Verify signature
    if (INTOUCH_WEBHOOK_SECRET && !verifyIntouchSignature(rawBody, signature)) {
      console.error('Invalid Intouch webhook signature')
      return c.json({ success: false, error: 'Invalid signature' }, 401)
    }

    const payload = JSON.parse(rawBody)
    const { 
      transactionId, 
      referenceNumber, 
      status, 
      providerTransactionId,
      providerStatus 
    } = payload

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

        const newStatus = status === 'SUCCESS' ? 'PAYMENT_SUCCESS' : 
                         status === 'FAILED' ? 'PAYMENT_FAILED' : 'PAYMENT_INITIATED'

        await db.update(apeSubscriptions)
          .set({
            status: newStatus,
            providerTransactionId,
            providerStatus,
            paymentCallbackPayload: payload,
            paymentCompletedAt: status === 'SUCCESS' ? new Date() : null,
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

        const newStatus = status === 'SUCCESS' ? 'COMPLETED' : 
                         status === 'FAILED' ? 'FAILED' : 'PROCESSING'

        await db.update(transactionIntents)
          .set({
            status: newStatus,
            providerTransactionId,
            providerStatus,
            updatedAt: new Date()
          })
          .where(eq(transactionIntents.id, intent.id))

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

export default app
