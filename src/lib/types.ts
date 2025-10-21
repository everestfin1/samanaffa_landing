// Type definitions migrated from Prisma to Drizzle
// These types match the schema.ts enums and are used across the application

export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
export type OtpType = 'EMAIL' | 'SMS';
export type AccountType = 'SAMA_NAFFA' | 'APE_INVESTMENT';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type IntentType = 'DEPOSIT' | 'INVESTMENT' | 'WITHDRAWAL';
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
export type AdminRole = 'ADMIN' | 'MANAGER' | 'SUPPORT';
export type SessionType = 'REGISTRATION' | 'LOGIN';
export type NotificationType = 'KYC_STATUS' | 'SUCCESS' | 'ERROR' | 'WARNING' | 'TRANSACTION' | 'SECURITY';
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

