import { pgTable, text, timestamp, boolean, decimal, integer, json, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const kycStatusEnum = pgEnum('KycStatus', ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']);
export const otpTypeEnum = pgEnum('OtpType', ['EMAIL', 'SMS']);
export const accountTypeEnum = pgEnum('AccountType', ['SAMA_NAFFA', 'APE_INVESTMENT']);
export const accountStatusEnum = pgEnum('AccountStatus', ['ACTIVE', 'INACTIVE', 'SUSPENDED']);
export const intentTypeEnum = pgEnum('IntentType', ['DEPOSIT', 'INVESTMENT', 'WITHDRAWAL']);
export const transactionStatusEnum = pgEnum('TransactionStatus', ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED']);
export const verificationStatusEnum = pgEnum('VerificationStatus', ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW']);
export const adminRoleEnum = pgEnum('AdminRole', ['ADMIN', 'MANAGER', 'SUPPORT']);
export const sessionTypeEnum = pgEnum('SessionType', ['REGISTRATION', 'LOGIN']);
export const notificationTypeEnum = pgEnum('NotificationType', ['KYC_STATUS', 'SUCCESS', 'ERROR', 'WARNING', 'TRANSACTION', 'SECURITY']);
export const notificationPriorityEnum = pgEnum('NotificationPriority', ['LOW', 'NORMAL', 'HIGH', 'URGENT']);
export const apeSubscriptionStatusEnum = pgEnum('ApeSubscriptionStatus', ['PENDING', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CANCELLED']);

// Sponsor code status enum
export const sponsorCodeStatusEnum = pgEnum('SponsorCodeStatus', ['ACTIVE', 'INACTIVE', 'EXPIRED']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
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
  otpVerifiedAt: timestamp('otpVerifiedAt', { mode: 'date' }),
  kycStatus: kycStatusEnum('kycStatus').notNull().default('PENDING'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
  civilite: text('civilite'),
  country: text('country'),
  region: text('region'),
  department: text('department'),
  arrondissement: text('arrondissement'),
  district: text('district'),
  domaineActivite: text('domaineActivite'),
  idExpiryDate: timestamp('idExpiryDate', { mode: 'date' }),
  idIssueDate: timestamp('idIssueDate', { mode: 'date' }),
  idNumber: text('idNumber'),
  idType: text('idType'),
  marketingAccepted: boolean('marketingAccepted').notNull().default(false),
  metiers: text('metiers'),
  placeOfBirth: text('placeOfBirth'),
  privacyAccepted: boolean('privacyAccepted').notNull().default(false),
  signature: text('signature'),
  statutEmploi: text('statutEmploi'),
  termsAccepted: boolean('termsAccepted').notNull().default(false),
  // Account lockout fields
  failedAttempts: integer('failedAttempts').notNull().default(0),
  lockedUntil: timestamp('lockedUntil', { mode: 'date' }),
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

// Registration Sessions table
export const registrationSessions = pgTable('registration_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  data: text('data').notNull(),
  type: sessionTypeEnum('type').notNull().default('REGISTRATION'),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

// OTP Codes table
export const otpCodes = pgTable('otp_codes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
  registrationSessionId: text('registrationSessionId').references(() => registrationSessions.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  type: otpTypeEnum('type').notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  used: boolean('used').notNull().default(false),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

// User Accounts table
export const userAccounts = pgTable('user_accounts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountType: accountTypeEnum('accountType').notNull(),
  accountNumber: text('accountNumber').notNull().unique(),
  productCode: text('productCode'),
  productName: text('productName'),
  interestRate: decimal('interestRate', { precision: 15, scale: 2 }),
  lockPeriodMonths: integer('lockPeriodMonths'),
  lockedUntil: timestamp('lockedUntil', { mode: 'date' }),
  allowAdditionalDeposits: boolean('allowAdditionalDeposits').notNull().default(true),
  metadata: json('metadata'),
  balance: decimal('balance', { precision: 15, scale: 2 }).notNull().default('0.00'),
  status: accountStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

// Transaction Intents table
export const transactionIntents = pgTable('transaction_intents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull().references(() => userAccounts.id, { onDelete: 'cascade' }),
  accountType: accountTypeEnum('accountType').notNull(),
  intentType: intentTypeEnum('intentType').notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  paymentMethod: text('paymentMethod').notNull(),
  investmentTranche: text('investmentTranche'),
  investmentTerm: integer('investmentTerm'),
  userNotes: text('userNotes'),
  adminNotes: text('adminNotes'),
  status: transactionStatusEnum('status').notNull().default('PENDING'),
  referenceNumber: text('referenceNumber').notNull().unique(),
  providerTransactionId: text('providerTransactionId').unique(),
  providerStatus: text('providerStatus'),
  lastCallbackAt: timestamp('lastCallbackAt', { mode: 'date' }),
  lastCallbackPayload: json('lastCallbackPayload'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// Payment Callback Logs table
export const paymentCallbackLogs = pgTable('payment_callback_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  transactionIntentId: text('transactionIntentId').notNull().references(() => transactionIntents.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  payload: json('payload').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

// KYC Documents table
export const kycDocuments = pgTable('kyc_documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  documentType: text('documentType').notNull(),
  fileUrl: text('fileUrl').notNull(),
  fileName: text('fileName').notNull(),
  uploadDate: timestamp('uploadDate', { mode: 'date' }).notNull().defaultNow(),
  verificationStatus: verificationStatusEnum('verificationStatus').notNull().default('PENDING'),
  adminNotes: text('adminNotes'),
});

// Admin Users table
export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  name: text('name').notNull(),
  role: adminRoleEnum('role').notNull().default('ADMIN'),
  lastLogin: timestamp('lastLogin', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  failedAttempts: integer('failedAttempts').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  lockedUntil: timestamp('lockedUntil', { mode: 'date' }),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// Admin Audit Logs table
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  adminId: text('adminId').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // e.g., 'KYC_APPROVED', 'USER_SUSPENDED', 'TRANSACTION_UPDATED'
  resourceType: text('resourceType').notNull(), // e.g., 'user', 'transaction', 'kyc_document'
  resourceId: text('resourceId'), // ID of the affected resource
  details: json('details'), // Additional context about the action
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: notificationTypeEnum('type').notNull(),
  priority: notificationPriorityEnum('priority').notNull(),
  isRead: boolean('isRead').notNull().default(false),
  metadata: text('metadata'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// APE Sponsor Codes table - stores sponsor/referral codes created by admin
export const apeSponsorCodes = pgTable('ape_sponsor_codes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(),
  description: text('description'),
  createdBy: text('createdBy').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  status: sponsorCodeStatusEnum('status').notNull().default('ACTIVE'),
  usageCount: integer('usageCount').notNull().default(0),
  maxUsage: integer('maxUsage'), // null means unlimited
  expiresAt: timestamp('expiresAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// APE Subscriptions table - stores subscription data before user account creation
export const apeSubscriptions = pgTable('ape_subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  referenceNumber: text('referenceNumber').notNull().unique(),
  // Personal info
  civilite: text('civilite').notNull(),
  prenom: text('prenom').notNull(),
  nom: text('nom').notNull(),
  email: text('email').notNull(),
  telephone: text('telephone').notNull(),
  paysResidence: text('paysResidence').notNull(),
  ville: text('ville').notNull(),
  categorieSocioprofessionnelle: text('categorieSocioprofessionnelle').notNull(),
  // Investment info
  trancheInteresse: text('trancheInteresse').notNull(),
  montantCfa: decimal('montantCfa', { precision: 15, scale: 2 }).notNull(),
  // Marketing tracking
  codeParrainage: text('codeParrainage'),
  // Payment info
  status: apeSubscriptionStatusEnum('status').notNull().default('PENDING'),
  providerTransactionId: text('providerTransactionId'),
  providerStatus: text('providerStatus'),
  paymentCallbackPayload: json('paymentCallbackPayload'),
  paymentInitiatedAt: timestamp('paymentInitiatedAt', { mode: 'date' }),
  paymentCompletedAt: timestamp('paymentCompletedAt', { mode: 'date' }),
  // Timestamps
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  kycDocuments: many(kycDocuments),
  otpCodes: many(otpCodes),
  accounts: many(userAccounts),
  transactionIntents: many(transactionIntents),
  notifications: many(notifications),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const registrationSessionsRelations = relations(registrationSessions, ({ many }) => ({
  otpCodes: many(otpCodes),
}));

export const otpCodesRelations = relations(otpCodes, ({ one }) => ({
  user: one(users, {
    fields: [otpCodes.userId],
    references: [users.id],
  }),
  registrationSession: one(registrationSessions, {
    fields: [otpCodes.registrationSessionId],
    references: [registrationSessions.id],
  }),
}));

export const userAccountsRelations = relations(userAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [userAccounts.userId],
    references: [users.id],
  }),
  transactionIntents: many(transactionIntents),
}));

export const transactionIntentsRelations = relations(transactionIntents, ({ one, many }) => ({
  user: one(users, {
    fields: [transactionIntents.userId],
    references: [users.id],
  }),
  account: one(userAccounts, {
    fields: [transactionIntents.accountId],
    references: [userAccounts.id],
  }),
  paymentCallbacks: many(paymentCallbackLogs),
}));

export const paymentCallbackLogsRelations = relations(paymentCallbackLogs, ({ one }) => ({
  transactionIntent: one(transactionIntents, {
    fields: [paymentCallbackLogs.transactionIntentId],
    references: [transactionIntents.id],
  }),
}));

export const kycDocumentsRelations = relations(kycDocuments, ({ one }) => ({
  user: one(users, {
    fields: [kycDocuments.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type OtpCode = typeof otpCodes.$inferSelect;
export type NewOtpCode = typeof otpCodes.$inferInsert;
export type UserAccount = typeof userAccounts.$inferSelect;
export type NewUserAccount = typeof userAccounts.$inferInsert;
export type TransactionIntent = typeof transactionIntents.$inferSelect;
export type NewTransactionIntent = typeof transactionIntents.$inferInsert;
export type PaymentCallbackLog = typeof paymentCallbackLogs.$inferSelect;
export type NewPaymentCallbackLog = typeof paymentCallbackLogs.$inferInsert;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type NewKycDocument = typeof kycDocuments.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type RegistrationSession = typeof registrationSessions.$inferSelect;
export type NewRegistrationSession = typeof registrationSessions.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type ApeSubscription = typeof apeSubscriptions.$inferSelect;
export type NewApeSubscription = typeof apeSubscriptions.$inferInsert;
export type ApeSponsorCode = typeof apeSponsorCodes.$inferSelect;
export type NewApeSponsorCode = typeof apeSponsorCodes.$inferInsert;
