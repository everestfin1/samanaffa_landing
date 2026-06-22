#!/usr/bin/env tsx

/**
 * Script to check current phone number formats in the database
 */

import { count, ne } from 'drizzle-orm'
import { db } from '../src/lib/db'
import { users } from '../src/lib/db/schema'

async function checkPhoneNumbers() {
  console.log('🔍 Checking phone numbers in database...')

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
      .where(ne(users.phone, ''))

    console.log(`📱 Found ${usersWithPhones.length} users with phone numbers:\n`)

    usersWithPhones.forEach((user, index) => {
      console.log(`${index + 1}. User: ${user.firstName} ${user.lastName}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Phone: "${user.phone}"`)
      console.log(`   Length: ${user.phone?.length || 0} characters`)
      console.log(`   Starts with +221: ${user.phone?.startsWith('+221') || false}`)
      console.log(`   Contains spaces: ${user.phone?.includes(' ') || false}`)
      console.log('')
    })

    const [countRow] = await db.select({ total: count() }).from(users)
    const totalUsers = countRow?.total ?? 0
    const usersWithoutPhones = totalUsers - usersWithPhones.length

    console.log(`📊 Summary:`)
    console.log(`   Total users: ${totalUsers}`)
    console.log(`   Users with phones: ${usersWithPhones.length}`)
    console.log(`   Users without phones: ${usersWithoutPhones}`)
  } catch (error) {
    console.error('❌ Error checking phone numbers:', error)
    process.exit(1)
  }
}

checkPhoneNumbers()
  .then(() => {
    console.log('✅ Phone number check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
