#!/usr/bin/env tsx

/**
 * Script to normalize existing phone numbers in the database
 * Converts numbers to standard format (+221XXXXXXXXX)
 */

import { and, eq, ne } from 'drizzle-orm'
import { db } from '../src/lib/db'
import { users } from '../src/lib/db/schema'
import { normalizeSenegalPhone } from '../src/lib/utils'

async function normalizePhoneNumbers() {
  console.log('🔄 Starting phone number normalization...')

  try {
    const usersWithPhones = await db
      .select({
        id: users.id,
        phone: users.phone,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(and(ne(users.phone, '')))

    console.log(`📱 Found ${usersWithPhones.length} users with phone numbers`)

    let updatedCount = 0
    let errorCount = 0

    for (const user of usersWithPhones) {
      try {
        const normalizedPhone = normalizeSenegalPhone(user.phone)

        if (!normalizedPhone) {
          console.warn(`⚠️  Invalid phone format for user ${user.id}: ${user.phone}`)
          errorCount++
          continue
        }

        if (normalizedPhone !== user.phone) {
          await db
            .update(users)
            .set({ phone: normalizedPhone })
            .where(eq(users.id, user.id))

          console.log(
            `✅ Updated user ${user.firstName} ${user.lastName} (${user.email}): ${user.phone} → ${normalizedPhone}`,
          )
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
  }
}

normalizePhoneNumbers()
  .then(() => {
    console.log('🎉 Phone number normalization completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
