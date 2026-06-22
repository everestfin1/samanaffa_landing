/**
 * InTouch Callback Testing Utility
 *
 * Usage:
 *   npx tsx scripts/test-intouch-callback.ts <reference-number> <status>
 */

import { eq } from 'drizzle-orm'
import { db } from '../src/lib/db'
import { transactionIntents, userAccounts, users } from '../src/lib/db/schema'

interface CallbackTestConfig {
  referenceNumber: string
  paymentStatus: string
  baseUrl?: string
  username?: string
  password?: string
}

async function loadIntentByReference(referenceNumber: string) {
  const [intentRow] = await db
    .select()
    .from(transactionIntents)
    .where(eq(transactionIntents.referenceNumber, referenceNumber))
    .limit(1)

  if (!intentRow) return null

  const [[account], [user]] = await Promise.all([
    db.select().from(userAccounts).where(eq(userAccounts.id, intentRow.accountId)).limit(1),
    db.select().from(users).where(eq(users.id, intentRow.userId)).limit(1),
  ])

  if (!account || !user) return null
  return { ...intentRow, account, user }
}

async function testCallback(config: CallbackTestConfig) {
  const {
    referenceNumber,
    paymentStatus,
    baseUrl = process.env.INTOUCH_CALLBACK_TEST_BASE_URL || 'http://localhost:3000',
    username = process.env.INTOUCH_BASIC_AUTH_USERNAME_TEST,
    password = process.env.INTOUCH_BASIC_AUTH_PASSWORD_TEST,
  } = config

  if (!username || !password) {
    console.error('❌ Missing required environment variables:')
    console.error('   INTOUCH_BASIC_AUTH_USERNAME_TEST')
    console.error('   INTOUCH_BASIC_AUTH_PASSWORD_TEST')
    process.exit(1)
  }

  console.log('\n=== InTouch Callback Test ===\n')

  const intent = await loadIntentByReference(referenceNumber)

  if (!intent) {
    console.error(`❌ Transaction intent not found: ${referenceNumber}`)
    process.exit(1)
  }

  console.log('✅ Transaction intent found:')
  console.log(`   ID: ${intent.id}`)
  console.log(`   Status: ${intent.status}`)
  console.log(`   Amount: ${intent.amount.toString()} FCFA`)
  console.log(`   User: ${intent.user.firstName} ${intent.user.lastName}`)
  console.log(`   Account: ${intent.account.accountNumber}\n`)

  const callbackPayload = {
    payment_mode: 'INTOUCH_SERVICE_CODE',
    paid_sum: intent.amount.toString(),
    paid_amount: intent.amount.toString(),
    payment_token: `TEST_${Date.now()}`,
    payment_status: paymentStatus,
    command_number: referenceNumber,
    payment_validation_date: Date.now().toString(),
  }

  console.log('Callback payload:')
  console.log(JSON.stringify(callbackPayload, null, 2))
  console.log()

  const basicAuth = Buffer.from(`${username}:${password}`).toString('base64')

  console.log('Testing GET callback...')
  const queryParams = new URLSearchParams(callbackPayload as Record<string, string>).toString()
  const getUrl = `${baseUrl}/api/payments/intouch/callback?${queryParams}`

  try {
    const getResponse = await fetch(getUrl, {
      method: 'GET',
      headers: { Authorization: `Basic ${basicAuth}` },
    })
    const getResult = await getResponse.json()
    console.log(`GET Response [${getResponse.status}]:`, JSON.stringify(getResult, null, 2))
    console.log()
  } catch (error) {
    console.error('❌ GET request failed:', error)
    console.log()
  }

  console.log('Testing POST callback (JSON)...')
  try {
    const postResponse = await fetch(`${baseUrl}/api/payments/intouch/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(callbackPayload),
    })
    const postResult = await postResponse.json()
    console.log(`POST Response [${postResponse.status}]:`, JSON.stringify(postResult, null, 2))
    console.log()
  } catch (error) {
    console.error('❌ POST request failed:', error)
    console.log()
  }

  console.log('Verifying database updates...')
  const updatedIntent = await loadIntentByReference(referenceNumber)

  if (updatedIntent) {
    console.log('✅ Transaction intent updated:')
    console.log(`   Status: ${intent.status} → ${updatedIntent.status}`)
    console.log(`   Provider Status: ${updatedIntent.providerStatus || 'N/A'}`)
    console.log(`   Provider Transaction ID: ${updatedIntent.providerTransactionId || 'N/A'}`)
    console.log(`   Last Callback At: ${updatedIntent.lastCallbackAt?.toISOString() || 'N/A'}`)
    console.log(`   Account Balance: ${updatedIntent.account.balance.toString()} FCFA`)
  }

  console.log('\n=== Test Complete ===\n')
}

const args = process.argv.slice(2)
const referenceNumber = args[0]
const paymentStatus = args[1] || '200'
const baseUrl = args[2]

if (!referenceNumber) {
  console.error(
    'Usage: npx tsx scripts/test-intouch-callback.ts <reference-number> [status] [base-url]',
  )
  process.exit(1)
}

testCallback({ referenceNumber, paymentStatus, baseUrl }).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
