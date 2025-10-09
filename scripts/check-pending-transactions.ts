/**
 * Pending Transactions Checker
 * 
 * This script queries the database to find and display transaction intents
 * that may be stuck in pending status or missing callback data.
 * 
 * Usage:
 *   npx tsx scripts/check-pending-transactions.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPendingTransactions() {
  console.log('\n=== Checking Pending Transactions ===\n');

  // Find all pending transactions
  console.log('📊 Fetching pending transaction intents...\n');
  const pendingIntents = await prisma.transactionIntent.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      user: true,
      account: true,
      paymentCallbacks: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (pendingIntents.length === 0) {
    console.log('✅ No pending transactions found!\n');
  } else {
    console.log(`⚠️  Found ${pendingIntents.length} pending transaction(s):\n`);

    pendingIntents.forEach((intent, index) => {
      console.log(`${index + 1}. Transaction Intent ID: ${intent.id}`);
      console.log(`   Reference Number: ${intent.referenceNumber}`);
      console.log(`   Amount: ${intent.amount.toString()} FCFA`);
      console.log(`   Type: ${intent.intentType}`);
      console.log(`   Payment Method: ${intent.paymentMethod}`);
      console.log(`   User: ${intent.user.firstName} ${intent.user.lastName} (${intent.user.email})`);
      console.log(`   Account: ${intent.account.accountNumber}`);
      console.log(`   Created: ${intent.createdAt.toISOString()}`);
      console.log(`   Provider Transaction ID: ${intent.providerTransactionId || 'NOT SET'}`);
      console.log(`   Provider Status: ${intent.providerStatus || 'NOT SET'}`);
      console.log(`   Last Callback: ${intent.lastCallbackAt?.toISOString() || 'NEVER RECEIVED'}`);
      
      if (intent.paymentCallbacks.length > 0) {
        console.log(`   Latest Callback Status: ${intent.paymentCallbacks[0].status}`);
        console.log(`   Latest Callback Time: ${intent.paymentCallbacks[0].createdAt.toISOString()}`);
      } else {
        console.log(`   Callbacks: NONE`);
      }
      
      console.log();
    });
  }

  // Find transactions with callbacks but still pending
  console.log('🔍 Checking transactions that received callbacks but are still pending...\n');
  const pendingWithCallbacks = await prisma.transactionIntent.findMany({
    where: {
      status: 'PENDING',
      lastCallbackAt: {
        not: null,
      },
    },
    include: {
      user: true,
      paymentCallbacks: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (pendingWithCallbacks.length === 0) {
    console.log('✅ No pending transactions with callbacks found\n');
  } else {
    console.log(`⚠️  Found ${pendingWithCallbacks.length} pending transaction(s) with callbacks:\n`);

    pendingWithCallbacks.forEach((intent, index) => {
      console.log(`${index + 1}. Reference: ${intent.referenceNumber}`);
      console.log(`   Last Callback: ${intent.lastCallbackAt?.toISOString()}`);
      console.log(`   Provider Status: ${intent.providerStatus || 'N/A'}`);
      console.log(`   Number of Callbacks: ${intent.paymentCallbacks.length}`);
      
      if (intent.paymentCallbacks.length > 0) {
        console.log(`   Callback Statuses: ${intent.paymentCallbacks.map(cb => cb.status).join(', ')}`);
      }
      
      console.log();
    });
  }

  // Find transactions missing provider transaction ID
  console.log('🔍 Checking transactions missing provider transaction ID...\n');
  const missingProviderId = await prisma.transactionIntent.findMany({
    where: {
      paymentMethod: 'intouch',
      providerTransactionId: null,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (missingProviderId.length === 0) {
    console.log('✅ All recent InTouch transactions have provider IDs\n');
  } else {
    console.log(`⚠️  Found ${missingProviderId.length} InTouch transaction(s) missing provider ID:\n`);

    missingProviderId.forEach((intent, index) => {
      console.log(`${index + 1}. Reference: ${intent.referenceNumber}`);
      console.log(`   Status: ${intent.status}`);
      console.log(`   Amount: ${intent.amount.toString()} FCFA`);
      console.log(`   User: ${intent.user.email}`);
      console.log(`   Created: ${intent.createdAt.toISOString()}`);
      console.log(`   Last Callback: ${intent.lastCallbackAt?.toISOString() || 'NEVER'}`);
      console.log();
    });
  }

  // Recent completed transactions (for comparison)
  console.log('✅ Recent completed transactions (last 5):\n');
  const completedIntents = await prisma.transactionIntent.findMany({
    where: {
      status: 'COMPLETED',
      paymentMethod: 'intouch',
    },
    include: {
      user: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 5,
  });

  if (completedIntents.length === 0) {
    console.log('No completed InTouch transactions found\n');
  } else {
    completedIntents.forEach((intent, index) => {
      console.log(`${index + 1}. Reference: ${intent.referenceNumber}`);
      console.log(`   Amount: ${intent.amount.toString()} FCFA`);
      console.log(`   Completed: ${intent.updatedAt.toISOString()}`);
      console.log(`   Provider ID: ${intent.providerTransactionId || 'N/A'}`);
      console.log(`   Provider Status: ${intent.providerStatus || 'N/A'}`);
      console.log();
    });
  }

  // Summary statistics
  console.log('📈 Summary Statistics:\n');
  const stats = await prisma.transactionIntent.groupBy({
    by: ['status', 'paymentMethod'],
    where: {
      paymentMethod: 'intouch',
    },
    _count: {
      id: true,
    },
  });

  console.log('InTouch Transactions by Status:');
  stats.forEach(stat => {
    console.log(`   ${stat.status}: ${stat._count.id}`);
  });
  console.log();

  console.log('=== Check Complete ===\n');
}

checkPendingTransactions()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

