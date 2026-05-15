ALTER TABLE "transaction_intents" ADD COLUMN IF NOT EXISTS "awaitingKycApproval" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "investorProfile" json;
