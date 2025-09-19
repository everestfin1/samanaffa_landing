import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@samanaffa.com' },
    update: {},
    create: {
      email: 'admin@samanaffa.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample user
  // const sampleUser = await prisma.user.upsert({
  //   where: { email: 'test@samanaffa.com' },
  //   update: {},
  //   create: {
  //     email: 'test@samanaffa.com',
  //     phone: '+221701234567',
  //     firstName: 'Test',
  //     lastName: 'User',
  //     dateOfBirth: new Date('1990-01-01'),
  //     nationality: 'Senegalese',
  //     address: 'Dakar, Senegal',
  //     city: 'Dakar',
  //     preferredLanguage: 'fr',
  //     emailVerified: true,
  //     phoneVerified: true,
  //     kycStatus: 'APPROVED',
  //   },
  // })

  // console.log('✅ Sample user created:', sampleUser.email)

  // // Create user accounts
  // const samaNaffaAccount = await prisma.userAccount.upsert({
  //   where: { accountNumber: 'SN-12345678-001' },
  //   update: {},
  //   create: {
  //     userId: sampleUser.id,
  //     accountType: 'SAMA_NAFFA',
  //     accountNumber: 'SN-12345678-001',
  //     balance: 50000.00,
  //     status: 'ACTIVE',
  //   },
  // })

  // const apeAccount = await prisma.userAccount.upsert({
  //   where: { accountNumber: 'APE-12345678-001' },
  //   update: {},
  //   create: {
  //     userId: sampleUser.id,
  //     accountType: 'APE_INVESTMENT',
  //     accountNumber: 'APE-12345678-001',
  //     balance: 0.00,
  //     status: 'ACTIVE',
  //   },
  // })

  // console.log('✅ User accounts created')

  // // Create sample transaction intents
  // const depositIntent = await prisma.transactionIntent.create({
  //   data: {
  //     userId: sampleUser.id,
  //     accountId: samaNaffaAccount.id,
  //     accountType: 'SAMA_NAFFA',
  //     intentType: 'DEPOSIT',
  //     amount: 25000.00,
  //     paymentMethod: 'Orange Money',
  //     referenceNumber: 'SN-DEP-20250101-120000-001-001',
  //     userNotes: 'Test deposit for savings goal',
  //     status: 'PENDING',
  //   },
  // })

  // const investmentIntent = await prisma.transactionIntent.create({
  //   data: {
  //     userId: sampleUser.id,
  //     accountId: apeAccount.id,
  //     accountType: 'APE_INVESTMENT',
  //     intentType: 'INVESTMENT',
  //     amount: 100000.00,
  //     paymentMethod: 'Bank Transfer',
  //     investmentTranche: 'A',
  //     investmentTerm: 5,
  //     referenceNumber: 'APE-INV-20250101-120000-001-002',
  //     userNotes: 'Long-term investment for retirement',
  //     status: 'PENDING',
  //   },
  // })

  // console.log('✅ Sample transaction intents created')

  // // Create sample KYC document
  // const kycDocument = await prisma.kycDocument.create({
  //   data: {
  //     userId: sampleUser.id,
  //     documentType: 'national_id',
  //     fileUrl: 'https://example.com/kyc/national_id.pdf',
  //     fileName: 'national_id.pdf',
  //     verificationStatus: 'APPROVED',
  //   },
  // })

  // console.log('✅ Sample KYC document created')

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
