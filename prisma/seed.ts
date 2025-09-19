import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const adminEmail = process.env.ADMIN_EMAIL || 'admin@samanaffa.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12) // Increased salt rounds for better security
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
      failedAttempts: 0,
    },
  })

  console.log('✅ Admin user created:', admin.email)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
