#!/usr/bin/env tsx

/**
 * Script to normalize existing phone numbers in the database
 * This script finds all users with phone numbers and converts them to the standard format (+221XXXXXXXXX)
 */

import { PrismaClient } from '@prisma/client'
import { normalizeSenegalPhone } from '../src/lib/utils'

const prisma = new PrismaClient()

async function normalizePhoneNumbers() {
  console.log('🔄 Starting phone number normalization...')

  try {
    // Get all users with phone numbers
    const usersWithPhones = await prisma.user.findMany({
      where: {
        AND: [
          { phone: { not: undefined } },
          { phone: { not: '' } }
        ]
      },
      select: {
        id: true,
        phone: true,
        email: true,
        firstName: true,
        lastName: true
      }
    })

    console.log(`📱 Found ${usersWithPhones.length} users with phone numbers`)

    let updatedCount = 0
    let errorCount = 0

    for (const user of usersWithPhones) {
      try {
        const normalizedPhone = normalizeSenegalPhone(user.phone!)

        if (!normalizedPhone) {
          console.warn(`⚠️  Invalid phone format for user ${user.id}: ${user.phone}`)
          errorCount++
          continue
        }

        // Only update if the phone number is different after normalization
        if (normalizedPhone !== user.phone) {
          await prisma.user.update({
            where: { id: user.id },
            data: { phone: normalizedPhone }
          })

          console.log(`✅ Updated user ${user.firstName} ${user.lastName} (${user.email}): ${user.phone} → ${normalizedPhone}`)
          updatedCount++
        }
      } catch (error) {
        console.error(`❌ Error updating user ${user.id}:`, error)
        errorCount++
      }
    }

    console.log(`\n📊 Normalization complete:`)
    console.log(`   ✅ Updated: ${updatedCount} phone numbers`)
    console.log(`   ⚠️  Errors: ${errorCount} phone numbers`)
    console.log(`   📱 Total processed: ${usersWithPhones.length} users`)

  } catch (error) {
    console.error('❌ Error during phone number normalization:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
normalizePhoneNumbers()
  .then(() => {
    console.log('🎉 Phone number normalization completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
