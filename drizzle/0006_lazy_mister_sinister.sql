CREATE TYPE "public"."ProfileCompletionStatus" AS ENUM('INCOMPLETE', 'COMPLETE');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profileCompletionStatus" "ProfileCompletionStatus" DEFAULT 'INCOMPLETE' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profileCompletionStep" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profileCompletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "termsAcceptedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "privacyAcceptedAt" timestamp;