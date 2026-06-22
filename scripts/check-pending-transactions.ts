/**
 * Pending Transactions Checker
 *
 * Usage: npx tsx scripts/check-pending-transactions.ts
 */

import { and, desc, eq, gte, inArray, isNotNull, isNull, sql } from 'drizzle-orm'
import { db } from '../src/lib/db'
import {
  paymentCallbackLogs,
  transactionIntents,
  userAccounts,
  users,
} from '../src/lib/db/schema'

type IntentRow = typeof transactionIntents.$inferSelect

async function attachRelations(intents: IntentRow[]) {
  if (intents.length === 0) return []

  const userIds = [...new Set(intents.map((i) => i.userId))]
  const accountIds = [...new Set(intents.map((i) => i.accountId))]
  const intentIds = intents.map((i) => i.id)

  const [userRows, accountRows, callbackRows] = await Promise.all([
    userIds.length > 0
      ? db.select().from(users).where(inArray(users.id, userIds))
      : Promise.resolve([]),
    accountIds.length > 0
      ? db.select().from(userAccounts).where(inArray(userAccounts.id, accountIds))
      : Promise.resolve([]),
    intentIds.length > 0
      ? db
          .select()
          .from(paymentCallbackLogs)
          .where(inArray(paymentCallbackLogs.transactionIntentId, intentIds))
          .orderBy(desc(paymentCallbackLogs.createdAt))
      : Promise.resolve([]),
  ])

  const userMap = new Map(userRows.map((u) => [u.id, u]))
  const accountMap = new Map(accountRows.map((a) => [a.id, a]))
  const callbacksByIntent = new Map<string, typeof callbackRows>()
  for (const cb of callbackRows) {
    const list = callbacksByIntent.get(cb.transactionIntentId) ?? []
    list.push(cb)
    callbacksByIntent.set(cb.transactionIntentId, list)
  }

  return intents.map((intent) => ({
    ...intent,
    user: userMap.get(intent.userId)!,
    account: accountMap.get(intent.accountId)!,
    paymentCallbacks: callbacksByIntent.get(intent.id) ?? [],
  }))
}

async function checkPendingTransactions() {
  console.log('\n=== Checking Pending Transactions ===\n')

  console.log('📊 Fetching pending transaction intents...\n')
  const pendingRows = await db
    .select()
    .from(transactionIntents)
    .where(eq(transactionIntents.status, 'PENDING'))
    .orderBy(desc(transactionIntents.createdAt))

  const pendingIntents = await attachRelations(pendingRows)

  if (pendingIntents.length === 0) {
    console.log('✅ No pending transactions found!\n')
  } else {
    console.log(`⚠️  Found ${pendingIntents.length} pending transaction(s):\n`)

    pendingIntents.forEach((intent, index) => {
      console.log(`${index + 1}. Transaction Intent ID: ${intent.id}`)
      console.log(`   Reference Number: ${intent.referenceNumber}`)
      console.log(`   Amount: ${intent.amount.toString()} FCFA`)
      console.log(`   Type: ${intent.intentType}`)
      console.log(`   Payment Method: ${intent.paymentMethod}`)
      console.log(`   User: ${intent.user.firstName} ${intent.user.lastName} (${intent.user.email})`)
      console.log(`   Account: ${intent.account.accountNumber}`)
      console.log(`   Created: ${intent.createdAt.toISOString()}`)
      console.log(`   Provider Transaction ID: ${intent.providerTransactionId || 'NOT SET'}`)
      console.log(`   Provider Status: ${intent.providerStatus || 'NOT SET'}`)
      console.log(`   Last Callback: ${intent.lastCallbackAt?.toISOString() || 'NEVER RECEIVED'}`)

      const latestCallback = intent.paymentCallbacks[0]
      if (latestCallback) {
        console.log(`   Latest Callback Status: ${latestCallback.status}`)
        console.log(`   Latest Callback Time: ${latestCallback.createdAt.toISOString()}`)
      } else {
        console.log(`   Callbacks: NONE`)
      }

      console.log()
    })
  }

  console.log('🔍 Checking transactions that received callbacks but are still pending...\n')
  const pendingWithCallbackRows = await db
    .select()
    .from(transactionIntents)
    .where(
      and(eq(transactionIntents.status, 'PENDING'), isNotNull(transactionIntents.lastCallbackAt)),
    )

  const pendingWithCallbacks = await attachRelations(pendingWithCallbackRows)

  if (pendingWithCallbacks.length === 0) {
    console.log('✅ No pending transactions with callbacks found\n')
  } else {
    console.log(`⚠️  Found ${pendingWithCallbacks.length} pending transaction(s) with callbacks:\n`)

    pendingWithCallbacks.forEach((intent, index) => {
      console.log(`${index + 1}. Reference: ${intent.referenceNumber}`)
      console.log(`   Last Callback: ${intent.lastCallbackAt?.toISOString()}`)
      console.log(`   Provider Status: ${intent.providerStatus || 'N/A'}`)
      console.log(`   Number of Callbacks: ${intent.paymentCallbacks.length}`)
      if (intent.paymentCallbacks.length > 0) {
        console.log(
          `   Callback Statuses: ${intent.paymentCallbacks.map((cb) => cb.status).join(', ')}`,
        )
      }
      console.log()
    })
  }

  console.log('🔍 Checking transactions missing provider transaction ID...\n')
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const missingRows = await db
    .select()
    .from(transactionIntents)
    .where(
      and(
        eq(transactionIntents.paymentMethod, 'intouch'),
        isNull(transactionIntents.providerTransactionId),
        gte(transactionIntents.createdAt, sevenDaysAgo),
      ),
    )
    .orderBy(desc(transactionIntents.createdAt))

  const missingProviderId = await attachRelations(missingRows)

  if (missingProviderId.length === 0) {
    console.log('✅ All recent InTouch transactions have provider IDs\n')
  } else {
    console.log(`⚠️  Found ${missingProviderId.length} InTouch transaction(s) missing provider ID:\n`)

    missingProviderId.forEach((intent, index) => {
      console.log(`${index + 1}. Reference: ${intent.referenceNumber}`)
      console.log(`   Status: ${intent.status}`)
      console.log(`   Amount: ${intent.amount.toString()} FCFA`)
      console.log(`   User: ${intent.user.email}`)
      console.log(`   Created: ${intent.createdAt.toISOString()}`)
      console.log(`   Last Callback: ${intent.lastCallbackAt?.toISOString() || 'NEVER'}`)
      console.log()
    })
  }

  console.log('✅ Recent completed transactions (last 5):\n')
  const completedRows = await db
    .select()
    .from(transactionIntents)
    .where(
      and(eq(transactionIntents.status, 'COMPLETED'), eq(transactionIntents.paymentMethod, 'intouch')),
    )
    .orderBy(desc(transactionIntents.updatedAt))
    .limit(5)

  const completedIntents = await attachRelations(completedRows)

  if (completedIntents.length === 0) {
    console.log('No completed InTouch transactions found\n')
  } else {
    completedIntents.forEach((intent, index) => {
      console.log(`${index + 1}. Reference: ${intent.referenceNumber}`)
      console.log(`   Amount: ${intent.amount.toString()} FCFA`)
      console.log(`   Completed: ${intent.updatedAt.toISOString()}`)
      console.log(`   Provider ID: ${intent.providerTransactionId || 'N/A'}`)
      console.log(`   Provider Status: ${intent.providerStatus || 'N/A'}`)
      console.log()
    })
  }

  console.log('📈 Summary Statistics:\n')
  const stats = await db
    .select({
      status: transactionIntents.status,
      paymentMethod: transactionIntents.paymentMethod,
      count: sql<number>`count(*)::int`,
    })
    .from(transactionIntents)
    .where(eq(transactionIntents.paymentMethod, 'intouch'))
    .groupBy(transactionIntents.status, transactionIntents.paymentMethod)

  console.log('InTouch Transactions by Status:')
  stats.forEach((stat) => {
    console.log(`   ${stat.status}: ${stat.count}`)
  })
  console.log()

  console.log('=== Check Complete ===\n')
}

checkPendingTransactions().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
