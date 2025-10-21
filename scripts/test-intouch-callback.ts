/**
 * InTouch Callback Testing Utility
 *
 * This script simulates InTouch payment callbacks to test the webhook endpoint locally.
 * It helps verify that the callback endpoint correctly processes payment notifications.
 *
 * IMPORTANT: Reference numbers now use hyphens instead of underscores to comply with InTouch requirements.
 *
 * Usage:
 *   npx tsx scripts/test-intouch-callback.ts <reference-number> <status>
 *
 * Examples:
 *   npx tsx scripts/test-intouch-callback.ts SAMA-NAFFA-DEPOSIT-1234567890-ABC123 200
 *   npx tsx scripts/test-intouch-callback.ts SAMA-NAFFA-DEPOSIT-1234567890-ABC123 420
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CallbackTestConfig {
  referenceNumber: string;
  paymentStatus: string;
  baseUrl?: string;
  username?: string;
  password?: string;
}

async function testCallback(config: CallbackTestConfig) {
  const {
    referenceNumber,
    paymentStatus,
    baseUrl = process.env.INTOUCH_CALLBACK_TEST_BASE_URL || 'https://samanaffa.com',
    username = process.env.INTOUCH_BASIC_AUTH_USERNAME_TEST,
    password = process.env.INTOUCH_BASIC_AUTH_PASSWORD_TEST,
  } = config;

  // Validate required credentials
  if (!username || !password) {
    console.error('❌ Missing required environment variables:');
    console.error('   INTOUCH_BASIC_AUTH_USERNAME_TEST');
    console.error('   INTOUCH_BASIC_AUTH_PASSWORD_TEST');
    console.error('\nPlease set these in your .env file or environment.');
    process.exit(1);
  }

  console.log('\n=== InTouch Callback Test ===\n');

  // Fetch transaction intent from database
  console.log('Looking up transaction intent...');
  const intent = await prisma.transactionIntent.findUnique({
    where: { referenceNumber },
    include: { account: true, user: true },
  });

  if (!intent) {
    console.error(`❌ Transaction intent not found: ${referenceNumber}`);
    console.log('\nTip: Create a transaction first by making a deposit through the UI');
    process.exit(1);
  }

  console.log('✅ Transaction intent found:');
  console.log(`   ID: ${intent.id}`);
  console.log(`   Status: ${intent.status}`);
  console.log(`   Amount: ${intent.amount.toString()} FCFA`);
  console.log(`   User: ${intent.user.firstName} ${intent.user.lastName}`);
  console.log(`   Account: ${intent.account.accountNumber}\n`);

  // Prepare callback payload (InTouch format)
  const callbackPayload = {
    payment_mode: 'INTOUCH_SERVICE_CODE',
    paid_sum: intent.amount.toString(),
    paid_amount: intent.amount.toString(),
    payment_token: `TEST_${Date.now()}`,
    payment_status: paymentStatus,
    command_number: referenceNumber,
    payment_validation_date: Date.now().toString(),
  };

  console.log('Callback payload:');
  console.log(JSON.stringify(callbackPayload, null, 2));
  console.log();

  // Test GET request (with query params)
  console.log('Testing GET callback...');
  const queryParams = new URLSearchParams(callbackPayload as any).toString();
  const getUrl = `${baseUrl}/api/payments/intouch/callback?${queryParams}`;

  // Create Basic Auth header
  const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const getResponse = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
      },
    });

    const getResult = await getResponse.json();
    console.log(`GET Response [${getResponse.status}]:`, JSON.stringify(getResult, null, 2));
    console.log();
  } catch (error) {
    console.error('❌ GET request failed:', error);
    console.log();
  }

  // Test POST request (with JSON body)
  console.log('Testing POST callback (JSON)...');
  try {
    const postResponse = await fetch(`${baseUrl}/api/payments/intouch/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: JSON.stringify(callbackPayload),
    });

    const postResult = await postResponse.json();
    console.log(`POST Response [${postResponse.status}]:`, JSON.stringify(postResult, null, 2));
    console.log();
  } catch (error) {
    console.error('❌ POST request failed:', error);
    console.log();
  }

  // Test POST request (with form-urlencoded)
  console.log('Testing POST callback (form-urlencoded)...');
  try {
    const formData = new URLSearchParams(callbackPayload as any).toString();
    const formResponse = await fetch(`${baseUrl}/api/payments/intouch/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: formData,
    });

    const formResult = await formResponse.json();
    console.log(`POST Form Response [${formResponse.status}]:`, JSON.stringify(formResult, null, 2));
    console.log();
  } catch (error) {
    console.error('❌ POST form request failed:', error);
    console.log();
  }

  // Verify database updates
  console.log('Verifying database updates...');
  const updatedIntent = await prisma.transactionIntent.findUnique({
    where: { referenceNumber },
    include: { account: true },
  });

  if (updatedIntent) {
    console.log('✅ Transaction intent updated:');
    console.log(`   Status: ${intent.status} → ${updatedIntent.status}`);
    console.log(`   Provider Status: ${updatedIntent.providerStatus || 'N/A'}`);
    console.log(`   Provider Transaction ID: ${updatedIntent.providerTransactionId || 'N/A'}`);
    console.log(`   Last Callback At: ${updatedIntent.lastCallbackAt?.toISOString() || 'N/A'}`);
    console.log(`   Account Balance: ${updatedIntent.account.balance.toString()} FCFA`);
  }

  console.log('\n=== Test Complete ===\n');
}

// Parse command line arguments
const args = process.argv.slice(2);
const referenceNumber = args[0];
const paymentStatus = args[1] || '200';
const baseUrl = args[2];

if (!referenceNumber) {
  console.error('Usage: npx tsx scripts/test-intouch-callback.ts <reference-number> [status] [base-url]');
  console.error('\nExamples:');
  console.error('  npx tsx scripts/test-intouch-callback.ts SAMA-NAFFA-DEPOSIT-1234567890-ABC123 200');
  console.error('  npx tsx scripts/test-intouch-callback.ts SAMA-NAFFA-DEPOSIT-1234567890-ABC123 420');
  console.error('  npx tsx scripts/test-intouch-callback.ts SAMA-NAFFA-DEPOSIT-1234567890-ABC123 200 http://localhost:3000');
  console.error('\nStatus codes:');
  console.error('  200 = Success');
  console.error('  420 = Failure');
  process.exit(1);
}

testCallback({
  referenceNumber,
  paymentStatus,
  baseUrl,
})
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

