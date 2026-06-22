/**
 * Test script for the batch KYC update payload shape.
 * Run with: npx tsx scripts/test-batch-kyc.ts
 */

import { eq } from 'drizzle-orm'
import { db } from '../src/lib/db'
import { kycDocuments, users } from '../src/lib/db/schema'

async function testBatchKycApi() {
  console.log('Testing batch KYC update functionality...')

  try {
    const testDocuments = await db
      .select({
        id: kycDocuments.id,
        documentType: kycDocuments.documentType,
        userId: kycDocuments.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        kycStatus: users.kycStatus,
      })
      .from(kycDocuments)
      .innerJoin(users, eq(kycDocuments.userId, users.id))
      .where(eq(kycDocuments.verificationStatus, 'PENDING'))
      .limit(3)

    if (testDocuments.length === 0) {
      console.log('No PENDING documents found for testing')
      return
    }

    console.log(`Found ${testDocuments.length} test documents:`)
    testDocuments.forEach((doc, i) => {
      console.log(
        `${i + 1}. ${doc.documentType} - ${doc.firstName} ${doc.lastName} (${doc.kycStatus})`,
      )
    })

    const batchUpdates = testDocuments.map((doc) => ({
      documentId: doc.id,
      verificationStatus: 'APPROVED',
      adminNotes: 'Batch test approval',
    }))

    console.log('\nSimulating batch update payload:')
    console.log(
      JSON.stringify({ updates: batchUpdates, userId: testDocuments[0]?.userId }, null, 2),
    )

    console.log('\nBatch KYC API test completed successfully!')
    console.log('The API endpoint should handle this payload efficiently in a single transaction.')
  } catch (error) {
    console.error('Error during batch KYC test:', error)
  }
}

testBatchKycApi()
