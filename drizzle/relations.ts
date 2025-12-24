import { relations } from "drizzle-orm/relations";
import { adminUsers, apeSponsorCodes, users, otpCodes, registrationSessions, sessions, kycDocuments, transactionIntents, userAccounts, paymentCallbackLogs, notifications } from "./schema";

export const apeSponsorCodesRelations = relations(apeSponsorCodes, ({one}) => ({
	adminUser: one(adminUsers, {
		fields: [apeSponsorCodes.createdBy],
		references: [adminUsers.id]
	}),
}));

export const adminUsersRelations = relations(adminUsers, ({many}) => ({
	apeSponsorCodes: many(apeSponsorCodes),
}));

export const otpCodesRelations = relations(otpCodes, ({one}) => ({
	user: one(users, {
		fields: [otpCodes.userId],
		references: [users.id]
	}),
	registrationSession: one(registrationSessions, {
		fields: [otpCodes.registrationSessionId],
		references: [registrationSessions.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	otpCodes: many(otpCodes),
	sessions: many(sessions),
	kycDocuments: many(kycDocuments),
	transactionIntents: many(transactionIntents),
	userAccounts: many(userAccounts),
	notifications: many(notifications),
}));

export const registrationSessionsRelations = relations(registrationSessions, ({many}) => ({
	otpCodes: many(otpCodes),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const kycDocumentsRelations = relations(kycDocuments, ({one}) => ({
	user: one(users, {
		fields: [kycDocuments.userId],
		references: [users.id]
	}),
}));

export const transactionIntentsRelations = relations(transactionIntents, ({one, many}) => ({
	user: one(users, {
		fields: [transactionIntents.userId],
		references: [users.id]
	}),
	userAccount: one(userAccounts, {
		fields: [transactionIntents.accountId],
		references: [userAccounts.id]
	}),
	paymentCallbackLogs: many(paymentCallbackLogs),
}));

export const userAccountsRelations = relations(userAccounts, ({one, many}) => ({
	transactionIntents: many(transactionIntents),
	user: one(users, {
		fields: [userAccounts.userId],
		references: [users.id]
	}),
}));

export const paymentCallbackLogsRelations = relations(paymentCallbackLogs, ({one}) => ({
	transactionIntent: one(transactionIntents, {
		fields: [paymentCallbackLogs.transactionIntentId],
		references: [transactionIntents.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));