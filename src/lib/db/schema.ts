import { pgTable, text, timestamp, boolean, decimal, integer, json, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
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
export const profileCompletionStatusEnum = pgEnum('ProfileCompletionStatus', ['INCOMPLETE', 'COMPLETE']);
export const formDraftStatusEnum = pgEnum('FormDraftStatus', ['ABANDONED', 'CONTACTED', 'CONVERTED', 'DISMISSED']);

// Sponsor code status enum
export const sponsorCodeStatusEnum = pgEnum('SponsorCodeStatus', ['ACTIVE', 'INACTIVE', 'EXPIRED']);

// Field Agents table — Sama Naffa referral codes (field-agent attribution, no rewards)
export const fieldAgents = pgTable('field_agents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  phone: text('phone'),
  email: text('email'),
  region: text('region'),
  status: sponsorCodeStatusEnum('status').notNull().default('ACTIVE'),
  usageCount: integer('usageCount').notNull().default(0),
  maxUsage: integer('maxUsage'),
  expiresAt: timestamp('expiresAt', { mode: 'date' }),
  createdBy: text('createdBy').references(() => adminUsers.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});
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
  // New onboarding flow (T0-T6 mock) — stores quiz answers + recommended formula
  investorProfile: json('investorProfile'),
  // Profile completion tracking for post-login onboarding
  profileCompletionStatus: profileCompletionStatusEnum('profileCompletionStatus').notNull().default('INCOMPLETE'),
  profileCompletionStep: text('profileCompletionStep'),
  profileCompletedAt: timestamp('profileCompletedAt', { mode: 'date' }),
  termsAcceptedAt: timestamp('termsAcceptedAt', { mode: 'date' }),
  privacyAcceptedAt: timestamp('privacyAcceptedAt', { mode: 'date' }),
  /** JWT invalidation counter (AUTH-023) — bumped on logout / sensitive change. */
  sessionVersion: integer('sessionVersion').notNull().default(0),
  /** Sama Naffa field-agent attribution — which agent's code brought this signup. */
  referredByAgentId: text('referredByAgentId').references(() => fieldAgents.id, { onDelete: 'set null' }),
}, (table) => [
  index('users_referred_by_agent_idx').on(table.referredByAgentId),
]);

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
  // New onboarding flow: deposit programmed at T4, awaiting KYC validation before payment is triggered
  awaitingKycApproval: boolean('awaitingKycApproval').notNull().default(false),
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
  /** Redacted Didit decision snapshot (server-only, set on terminal status). */
  diditDecisionPayload: json('diditDecisionPayload'),
  /** MinIO/S3 object key when stored in sovereign object storage. */
  storageKey: text('storageKey'),
  /** didit | legacy_blob */
  source: text('source'),
  /** Didit session UUID for rapatriated assets. */
  diditSessionId: text('diditSessionId'),
  /** SHA-256 hex digest of stored object. */
  contentHash: text('contentHash'),
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

// PEE Subscription Status enum (payment lifecycle)
export const peeSubscriptionStatusEnum = pgEnum('PeeSubscriptionStatus', [
  'PENDING',
  'PAYMENT_INITIATED',
  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'CANCELLED',
]);

// PEE CRM status (admin follow-up on inquiry leads — separate from payment status)
export const peeCrmStatusEnum = pgEnum('PeeCrmStatus', ['NEW', 'CONTACTED', 'CONVERTED', 'DISMISSED']);

// PEE Leads table - inquiries + paid subscriptions
export const peeLeads = pgTable('pee_leads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  referenceNumber: text('referenceNumber').notNull().unique(),
  // Personal info
  civilite: text('civilite').notNull(),
  prenom: text('prenom').notNull(),
  nom: text('nom').notNull(),
  categorie: text('categorie').notNull(),
  pays: text('pays').notNull(),
  ville: text('ville').notNull(),
  telephone: text('telephone').notNull(),
  email: text('email'),
  // Investment info
  montantCfa: decimal('montantCfa', { precision: 15, scale: 2 }).notNull(),
  // Payment lifecycle (Intouch / subscribe flow)
  status: peeSubscriptionStatusEnum('status').notNull().default('PENDING'),
  /** Admin CRM pipeline for contact-form leads (not used for paid subscriptions). */
  crmStatus: peeCrmStatusEnum('crmStatus'),
  providerTransactionId: text('providerTransactionId'),
  providerStatus: text('providerStatus'),
  paymentCallbackPayload: json('paymentCallbackPayload'),
  paymentInitiatedAt: timestamp('paymentInitiatedAt', { mode: 'date' }),
  paymentCompletedAt: timestamp('paymentCompletedAt', { mode: 'date' }),
  // Admin
  adminNotes: text('adminNotes'),
  // Timestamps
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// Form drafts — abandoned / in-progress form telemetry (admin "Leads abandonnés")
export const formDrafts = pgTable('form_drafts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
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
}, (table) => [
  uniqueIndex('form_drafts_anonymous_form_type_unique').on(table.anonymousId, table.formType),
  index('form_drafts_status_idx').on(table.formType, table.status),
  index('form_drafts_email_idx').on(table.email),
  index('form_drafts_phone_idx').on(table.phone),
  index('form_drafts_score_idx').on(table.score),
]);

export const formEvents = pgTable('form_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  anonymousId: text('anonymousId').notNull(),
  formType: text('formType').notNull(),
  eventType: text('eventType').notNull(),
  fieldKey: text('fieldKey'),
  step: text('step'),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('form_events_anon_form_idx').on(table.anonymousId, table.formType),
  index('form_events_event_time_idx').on(table.eventType, table.createdAt),
]);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  sessions: many(sessions),
  kycDocuments: many(kycDocuments),
  otpCodes: many(otpCodes),
  accounts: many(userAccounts),
  transactionIntents: many(transactionIntents),
  notifications: many(notifications),
  referredByAgent: one(fieldAgents, {
    fields: [users.referredByAgentId],
    references: [fieldAgents.id],
  }),
}));

export const fieldAgentsRelations = relations(fieldAgents, ({ one, many }) => ({
  createdByAdmin: one(adminUsers, {
    fields: [fieldAgents.createdBy],
    references: [adminUsers.id],
  }),
  referredUsers: many(users),
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
export type FieldAgent = typeof fieldAgents.$inferSelect;
export type NewFieldAgent = typeof fieldAgents.$inferInsert;
export type PeeLead = typeof peeLeads.$inferSelect;
export type NewPeeLead = typeof peeLeads.$inferInsert;
export type FormDraft = typeof formDrafts.$inferSelect;
export type NewFormDraft = typeof formDrafts.$inferInsert;
// Dashboard Cards — admin-configurable overview widgets
export const dashboardCards = pgTable('dashboard_cards', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'stat' | 'chart' | 'list' | 'link' | 'group'
  dataSource: text('dataSource').notNull(), // e.g. 'aum', 'totalUsers', 'pendingKyc', 'recentActivity'
  color: text('color').notNull().default('default'), // 'default' | 'dark' | 'green' | 'amber' | 'blue' | 'red' | 'gradient'
  colSpan: integer('colSpan').notNull().default(3), // 1..12
  rowSpan: integer('rowSpan').notNull().default(1), // 1..4
  order: integer('order').notNull().default(0),
  icon: text('icon'),
  link: text('link'), // href for link-type cards
  visible: boolean('visible').notNull().default(true),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type DashboardCard = typeof dashboardCards.$inferSelect;
export type NewDashboardCard = typeof dashboardCards.$inferInsert;

export type FormEvent = typeof formEvents.$inferSelect;
export type NewFormEvent = typeof formEvents.$inferInsert;
