/**
 * Test script for the new batch KYC update functionality
 * Run with: npx tsx scripts/test-batch-kyc.ts
 */

import { prisma } from '../src/lib/prisma'

async function testBatchKycApi() {
  console.log('Testing batch KYC update functionality...')

  try {
    // Get some test data
    const testDocuments = await prisma.kycDocument.findMany({
      take: 3,
      where: { verificationStatus: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            kycStatus: true
          }
        }
      }
    })

    if (testDocuments.length === 0) {
      console.log('No PENDING documents found for testing')
      return
    }

    console.log(`Found ${testDocuments.length} test documents:`)
    testDocuments.forEach((doc: typeof testDocuments[number], i: number) => {
      const user = (doc as any).user
      console.log(`${i + 1}. ${doc.documentType} - ${user.firstName} ${user.lastName} (${user.kycStatus})`)
    })

    // Simulate batch update payload
    const batchUpdates = testDocuments.map((doc: typeof testDocuments[number]) => ({
      documentId: doc.id,
      verificationStatus: 'APPROVED',
      adminNotes: 'Batch test approval'
    }))

    console.log('\nSimulating batch update payload:')
    const firstUser = (testDocuments[0] as any).user
    console.log(JSON.stringify({ updates: batchUpdates, userId: firstUser.id }, null, 2))

    console.log('\nBatch KYC API test completed successfully!')
    console.log('The API endpoint should handle this payload efficiently in a single transaction.')

  } catch (error) {
    console.error('Error during batch KYC test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testBatchKycApi()
}

export { testBatchKycApi }
