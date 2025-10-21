import { db } from '../src/lib/db'
import { adminUsers } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const adminEmail = process.env.ADMIN_EMAIL || 'admin@samanaffa.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12) // Increased salt rounds for better security
  
  // Check if admin already exists
  const existingAdmin = await db.select()
    .from(adminUsers)
    .where(eq(adminUsers.email, adminEmail))
    .limit(1)

  if (existingAdmin.length > 0) {
    console.log('✅ Admin user already exists:', adminEmail)
  } else {
    const [admin] = await db.insert(adminUsers).values({
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
      failedAttempts: 0,
    }).returning()

    console.log('✅ Admin user created:', admin.email)
  }

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
