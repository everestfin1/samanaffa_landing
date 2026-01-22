import { pgTable, text, timestamp, boolean, decimal, integer, json, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const kycStatusEnum = pgEnum('KycStatus', ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'])
export const accountTypeEnum = pgEnum('AccountType', ['SAMA_NAFFA', 'APE_INVESTMENT'])
export const accountStatusEnum = pgEnum('AccountStatus', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])
export const intentTypeEnum = pgEnum('IntentType', ['DEPOSIT', 'INVESTMENT', 'WITHDRAWAL'])
export const transactionStatusEnum = pgEnum('TransactionStatus', ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED'])
export const verificationStatusEnum = pgEnum('VerificationStatus', ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'])
export const adminRoleEnum = pgEnum('AdminRole', ['ADMIN', 'MANAGER', 'SUPPORT'])
export const apeSubscriptionStatusEnum = pgEnum('ApeSubscriptionStatus', ['PENDING', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CANCELLED'])
export const formDraftStatusEnum = pgEnum('FormDraftStatus', ['ABANDONED', 'CONTACTED', 'CONVERTED', 'DISMISSED'])
export const sponsorCodeStatusEnum = pgEnum('SponsorCodeStatus', ['ACTIVE', 'INACTIVE', 'EXPIRED'])

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  passwordHash: text('passwordHash'),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  dateOfBirth: timestamp('dateOfBirth', { mode: 'date' }),
  nationality: text('nationality'),
  address: text('address'),
  city: text('city'),
  preferredLanguage: text('preferredLanguage').notNull().default('fr'),
  emailVerified: boolean('emailVerified').notNull().default(false),
  phoneVerified: boolean('phoneVerified').notNull().default(false),
  kycStatus: kycStatusEnum('kycStatus').notNull().default('PENDING'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  civilite: text('civilite'),
  country: text('country'),
  region: text('region'),
  failedAttempts: integer('failedAttempts').notNull().default(0),
  lockedUntil: timestamp('lockedUntil', { mode: 'date' }),
})

// User Accounts table
export const userAccounts = pgTable('user_accounts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  accountType: accountTypeEnum('accountType').notNull(),
  accountNumber: text('accountNumber').notNull().unique(),
  productCode: text('productCode'),
  productName: text('productName'),
  balance: decimal('balance', { precision: 15, scale: 2 }).notNull().default('0.00'),
  status: accountStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})

// Transaction Intents table
export const transactionIntents = pgTable('transaction_intents', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  accountId: text('accountId').notNull(),
  accountType: accountTypeEnum('accountType').notNull(),
  intentType: intentTypeEnum('intentType').notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text('paymentMethod').notNull(),
  status: transactionStatusEnum('status').notNull().default('PENDING'),
  referenceNumber: text('referenceNumber').notNull().unique(),
  providerTransactionId: text('providerTransactionId').unique(),
  providerStatus: text('providerStatus'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

// KYC Documents table
export const kycDocuments = pgTable('kyc_documents', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  documentType: text('documentType').notNull(),
  fileUrl: text('fileUrl').notNull(),
  fileName: text('fileName').notNull(),
  uploadDate: timestamp('uploadDate', { mode: 'date' }).notNull().defaultNow(),
  verificationStatus: verificationStatusEnum('verificationStatus').notNull().default('PENDING'),
  adminNotes: text('adminNotes'),
})

// Admin Users table
export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  name: text('name').notNull(),
  role: adminRoleEnum('role').notNull().default('ADMIN'),
  lastLogin: timestamp('lastLogin', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  failedAttempts: integer('failedAttempts').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  lockedUntil: timestamp('lockedUntil', { mode: 'date' }),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

// Admin Audit Logs table
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: text('id').primaryKey(),
  adminId: text('adminId').notNull(),
  action: text('action').notNull(),
  resourceType: text('resourceType').notNull(),
  resourceId: text('resourceId'),
  details: json('details'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})

// APE Sponsor Codes table
export const apeSponsorCodes = pgTable('ape_sponsor_codes', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  createdBy: text('createdBy').notNull(),
  status: sponsorCodeStatusEnum('status').notNull().default('ACTIVE'),
  usageCount: integer('usageCount').notNull().default(0),
  maxUsage: integer('maxUsage'),
  expiresAt: timestamp('expiresAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

// APE Subscriptions table
export const apeSubscriptions = pgTable('ape_subscriptions', {
  id: text('id').primaryKey(),
  referenceNumber: text('referenceNumber').notNull().unique(),
  civilite: text('civilite').notNull(),
  prenom: text('prenom').notNull(),
  nom: text('nom').notNull(),
  email: text('email').notNull(),
  telephone: text('telephone').notNull(),
  paysResidence: text('paysResidence').notNull(),
  ville: text('ville').notNull(),
  categorieSocioprofessionnelle: text('categorieSocioprofessionnelle').notNull(),
  trancheInteresse: text('trancheInteresse').notNull(),
  montantCfa: decimal('montantCfa', { precision: 15, scale: 2 }).notNull(),
  codeParrainage: text('codeParrainage'),
  status: apeSubscriptionStatusEnum('status').notNull().default('PENDING'),
  providerTransactionId: text('providerTransactionId'),
  providerStatus: text('providerStatus'),
  paymentCallbackPayload: json('paymentCallbackPayload'),
  paymentInitiatedAt: timestamp('paymentInitiatedAt', { mode: 'date' }),
  paymentCompletedAt: timestamp('paymentCompletedAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})

// Form drafts table
export const formDrafts = pgTable('form_drafts', {
  id: text('id').primaryKey(),
  anonymousId: text('anonymousId').notNull(),
  formType: text('formType').notNull(),
  draftData: json('draftData').notNull(),
  email: text('email'),
  phone: text('phone'),
  stepReached: text('stepReached'),
  fieldsCompleted: integer('fieldsCompleted'),
  totalFields: integer('totalFields'),
  source: json('source'),
  deviceInfo: json('deviceInfo'),
  score: integer('score').notNull().default(0),
  status: formDraftStatusEnum('status').notNull().default('ABANDONED'),
  adminNotes: text('adminNotes'),
  firstSeenAt: timestamp('firstSeenAt', { mode: 'date' }).notNull().defaultNow(),
  lastActivityAt: timestamp('lastActivityAt', { mode: 'date' }).notNull().defaultNow(),
  convertedAt: timestamp('convertedAt', { mode: 'date' }),
})

// PEE Leads table
export const peeLeads = pgTable('pee_leads', {
  id: text('id').primaryKey(),
  civilite: text('civilite').notNull(),
  prenom: text('prenom').notNull(),
  nom: text('nom').notNull(),
  categorie: text('categorie').notNull(),
  pays: text('pays').notNull(),
  ville: text('ville').notNull(),
  telephone: text('telephone').notNull(),
  email: text('email'),
  status: text('status').notNull().default('NEW'),
  adminNotes: text('adminNotes'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
})
