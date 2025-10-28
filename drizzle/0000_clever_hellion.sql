CREATE TYPE "public"."AccountStatus" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."AccountType" AS ENUM('SAMA_NAFFA', 'APE_INVESTMENT');--> statement-breakpoint
CREATE TYPE "public"."AdminRole" AS ENUM('ADMIN', 'MANAGER', 'SUPPORT');--> statement-breakpoint
CREATE TYPE "public"."IntentType" AS ENUM('DEPOSIT', 'INVESTMENT', 'WITHDRAWAL');--> statement-breakpoint
CREATE TYPE "public"."KycStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW');--> statement-breakpoint
CREATE TYPE "public"."NotificationPriority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."NotificationType" AS ENUM('KYC_STATUS', 'SUCCESS', 'ERROR', 'WARNING', 'TRANSACTION', 'SECURITY');--> statement-breakpoint
CREATE TYPE "public"."OtpType" AS ENUM('EMAIL', 'SMS');--> statement-breakpoint
CREATE TYPE "public"."SessionType" AS ENUM('REGISTRATION', 'LOGIN');--> statement-breakpoint
CREATE TYPE "public"."TransactionStatus" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."VerificationStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"name" text NOT NULL,
	"role" "AdminRole" DEFAULT 'ADMIN' NOT NULL,
	"lastLogin" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"failedAttempts" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"lockedUntil" timestamp,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "kyc_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"documentType" text NOT NULL,
	"fileUrl" text NOT NULL,
	"fileName" text NOT NULL,
	"uploadDate" timestamp DEFAULT now() NOT NULL,
	"verificationStatus" "VerificationStatus" DEFAULT 'PENDING' NOT NULL,
	"adminNotes" text
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" "NotificationType" NOT NULL,
	"priority" "NotificationPriority" NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"registrationSessionId" text,
	"code" text NOT NULL,
	"type" "OtpType" NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_callback_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"transactionIntentId" text NOT NULL,
	"status" text NOT NULL,
	"payload" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registration_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"data" text NOT NULL,
	"type" "SessionType" DEFAULT 'REGISTRATION' NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "transaction_intents" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"accountType" "AccountType" NOT NULL,
	"intentType" "IntentType" NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"paymentMethod" text NOT NULL,
	"investmentTranche" text,
	"investmentTerm" integer,
	"userNotes" text,
	"adminNotes" text,
	"status" "TransactionStatus" DEFAULT 'PENDING' NOT NULL,
	"referenceNumber" text NOT NULL,
	"providerTransactionId" text,
	"providerStatus" text,
	"lastCallbackAt" timestamp,
	"lastCallbackPayload" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transaction_intents_referenceNumber_unique" UNIQUE("referenceNumber"),
	CONSTRAINT "transaction_intents_providerTransactionId_unique" UNIQUE("providerTransactionId")
);
--> statement-breakpoint
CREATE TABLE "user_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountType" "AccountType" NOT NULL,
	"accountNumber" text NOT NULL,
	"productCode" text,
	"productName" text,
	"interestRate" numeric(15, 2),
	"lockPeriodMonths" integer,
	"lockedUntil" timestamp,
	"allowAdditionalDeposits" boolean DEFAULT true NOT NULL,
	"metadata" json,
	"balance" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"status" "AccountStatus" DEFAULT 'ACTIVE' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_accounts_accountNumber_unique" UNIQUE("accountNumber")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"passwordHash" text,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"dateOfBirth" timestamp,
	"nationality" text,
	"address" text,
	"city" text,
	"preferredLanguage" text DEFAULT 'fr' NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"phoneVerified" boolean DEFAULT false NOT NULL,
	"otpVerifiedAt" timestamp,
	"kycStatus" "KycStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"civilite" text,
	"country" text,
	"region" text,
	"department" text,
	"arrondissement" text,
	"district" text,
	"domaineActivite" text,
	"idExpiryDate" timestamp,
	"idIssueDate" timestamp,
	"idNumber" text,
	"idType" text,
	"marketingAccepted" boolean DEFAULT false NOT NULL,
	"metiers" text,
	"placeOfBirth" text,
	"privacyAccepted" boolean DEFAULT false NOT NULL,
	"signature" text,
	"statutEmploi" text,
	"termsAccepted" boolean DEFAULT false NOT NULL,
	"failedAttempts" integer DEFAULT 0 NOT NULL,
	"lockedUntil" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_registrationSessionId_registration_sessions_id_fk" FOREIGN KEY ("registrationSessionId") REFERENCES "public"."registration_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_callback_logs" ADD CONSTRAINT "payment_callback_logs_transactionIntentId_transaction_intents_id_fk" FOREIGN KEY ("transactionIntentId") REFERENCES "public"."transaction_intents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_intents" ADD CONSTRAINT "transaction_intents_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_intents" ADD CONSTRAINT "transaction_intents_accountId_user_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."user_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;