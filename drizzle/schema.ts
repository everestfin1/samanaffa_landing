import { pgTable, foreignKey, text, timestamp, boolean, uniqueIndex, numeric, integer, jsonb, varchar, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accountStatus = pgEnum("AccountStatus", ['ACTIVE', 'INACTIVE', 'SUSPENDED'])
export const accountType = pgEnum("AccountType", ['SAMA_NAFFA', 'APE_INVESTMENT'])
export const adminRole = pgEnum("AdminRole", ['ADMIN', 'MANAGER', 'SUPPORT'])
export const intentType = pgEnum("IntentType", ['DEPOSIT', 'INVESTMENT', 'WITHDRAWAL'])
export const kycStatus = pgEnum("KycStatus", ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'])
export const notificationPriority = pgEnum("NotificationPriority", ['LOW', 'NORMAL', 'HIGH', 'URGENT'])
export const notificationType = pgEnum("NotificationType", ['KYC_STATUS', 'SUCCESS', 'ERROR', 'WARNING', 'TRANSACTION', 'SECURITY'])
export const otpType = pgEnum("OtpType", ['EMAIL', 'SMS'])
export const sessionType = pgEnum("SessionType", ['REGISTRATION', 'LOGIN'])
export const transactionStatus = pgEnum("TransactionStatus", ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED'])
export const verificationStatus = pgEnum("VerificationStatus", ['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'])


export const otpCodes = pgTable("otp_codes", {
	id: text().primaryKey().notNull(),
	userId: text(),
	code: text().notNull(),
	type: otpType().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	used: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	registrationSessionId: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "otp_codes_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.registrationSessionId],
			foreignColumns: [registrationSessions.id],
			name: "otp_codes_registrationSessionId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	sessionToken: text().notNull(),
	userId: text().notNull(),
	expires: timestamp({ precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("sessions_sessionToken_key").using("btree", table.sessionToken.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const kycDocuments = pgTable("kyc_documents", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	documentType: text().notNull(),
	fileUrl: text().notNull(),
	fileName: text().notNull(),
	uploadDate: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	verificationStatus: verificationStatus().default('PENDING').notNull(),
	adminNotes: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "kyc_documents_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const transactionIntents = pgTable("transaction_intents", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	accountId: text().notNull(),
	accountType: accountType().notNull(),
	intentType: intentType().notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	paymentMethod: text().notNull(),
	investmentTranche: text(),
	investmentTerm: integer(),
	userNotes: text(),
	adminNotes: text(),
	status: transactionStatus().default('PENDING').notNull(),
	referenceNumber: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	providerTransactionId: text(),
	lastCallbackAt: timestamp({ precision: 3, mode: 'string' }),
	lastCallbackPayload: jsonb(),
	providerStatus: text(),
}, (table) => [
	uniqueIndex("transaction_intents_providerTransactionId_key").using("btree", table.providerTransactionId.asc().nullsLast().op("text_ops")),
	uniqueIndex("transaction_intents_referenceNumber_key").using("btree", table.referenceNumber.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "transaction_intents_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [userAccounts.id],
			name: "transaction_intents_accountId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const adminUsers = pgTable("admin_users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	passwordHash: text().notNull(),
	name: text().notNull(),
	role: adminRole().default('ADMIN').notNull(),
	lastLogin: timestamp({ precision: 3, mode: 'string' }),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	failedAttempts: integer().default(0).notNull(),
	isActive: boolean().default(true).notNull(),
	lockedUntil: timestamp({ precision: 3, mode: 'string' }),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("admin_users_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const userAccounts = pgTable("user_accounts", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	accountType: accountType().notNull(),
	accountNumber: text().notNull(),
	balance: numeric({ precision: 15, scale:  2 }).default('0.00').notNull(),
	status: accountStatus().default('ACTIVE').notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	allowAdditionalDeposits: boolean().default(true).notNull(),
	interestRate: numeric({ precision: 15, scale:  2 }),
	lockPeriodMonths: integer(),
	lockedUntil: timestamp({ precision: 3, mode: 'string' }),
	metadata: jsonb(),
	productCode: text(),
	productName: text(),
}, (table) => [
	uniqueIndex("user_accounts_accountNumber_key").using("btree", table.accountNumber.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_accounts_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const registrationSessions = pgTable("registration_sessions", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	data: text().notNull(),
	type: sessionType().default('REGISTRATION').notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const paymentCallbackLogs = pgTable("payment_callback_logs", {
	id: text().primaryKey().notNull(),
	transactionIntentId: text().notNull(),
	status: text().notNull(),
	payload: jsonb().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.transactionIntentId],
			foreignColumns: [transactionIntents.id],
			name: "payment_callback_logs_transactionIntentId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	title: text().notNull(),
	message: text().notNull(),
	type: notificationType().notNull(),
	priority: notificationPriority().notNull(),
	isRead: boolean().default(false).notNull(),
	metadata: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	phone: text().notNull(),
	firstName: text().notNull(),
	lastName: text().notNull(),
	dateOfBirth: timestamp({ precision: 3, mode: 'string' }),
	nationality: text(),
	address: text(),
	city: text(),
	preferredLanguage: text().default('fr').notNull(),
	emailVerified: boolean().default(false).notNull(),
	phoneVerified: boolean().default(false).notNull(),
	kycStatus: kycStatus().default('PENDING').notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	civilite: text(),
	country: text(),
	district: text(),
	domaineActivite: text(),
	idExpiryDate: timestamp({ precision: 3, mode: 'string' }),
	idIssueDate: timestamp({ precision: 3, mode: 'string' }),
	idNumber: text(),
	idType: text(),
	marketingAccepted: boolean().default(false).notNull(),
	metiers: text(),
	placeOfBirth: text(),
	privacyAccepted: boolean().default(false).notNull(),
	region: text(),
	signature: text(),
	statutEmploi: text(),
	termsAccepted: boolean().default(false).notNull(),
	otpVerifiedAt: timestamp({ precision: 3, mode: 'string' }),
	passwordHash: text(),
	arrondissement: text(),
	department: text(),
}, (table) => [
	uniqueIndex("users_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("users_phone_key").using("btree", table.phone.asc().nullsLast().op("text_ops")),
]);

export const peeLeads = pgTable("pee_leads", {
	id: text().primaryKey().notNull(),
	civilite: text().notNull(),
	prenom: text().notNull(),
	nom: text().notNull(),
	categorie: text().notNull(),
	pays: text().notNull(),
	ville: text().notNull(),
	telephone: text().notNull(),
	email: text(),
	status: text().default('NEW').notNull(),
	adminNotes: text(),
	createdAt: timestamp({ mode: 'string' }).default(sql`now()`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`now()`).notNull(),
});
