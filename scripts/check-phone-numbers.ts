#!/usr/bin/env tsx

/**
 * Script to check current phone number formats in the database
 * This helps debug phone number lookup issues
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPhoneNumbers() {
  console.log('🔍 Checking phone numbers in database...')

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

    // Also check if there are any users without phone numbers
    const totalUsers = await prisma.user.count()
    const usersWithoutPhones = totalUsers - usersWithPhones.length

    console.log(`📊 Summary:`)
    console.log(`   Total users: ${totalUsers}`)
    console.log(`   Users with phones: ${usersWithPhones.length}`)
    console.log(`   Users without phones: ${usersWithoutPhones}`)

  } catch (error) {
    console.error('❌ Error checking phone numbers:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
checkPhoneNumbers()
  .then(() => {
    console.log('✅ Phone number check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })
