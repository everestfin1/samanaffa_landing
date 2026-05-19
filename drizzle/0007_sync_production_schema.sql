-- Sync production DB with src/lib/db/schema.ts (idempotent).
-- Safe when pee_leads was created via drizzle/0004_add_pee_leads.sql (legacy text status)
-- or never received payment-column migrations from the Drizzle journal.

-- ── Enums ────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "public"."PeeSubscriptionStatus" AS ENUM(
    'PENDING', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint

DO $$ BEGIN
  CREATE TYPE "public"."PeeCrmStatus" AS ENUM('NEW', 'CONTACTED', 'CONVERTED', 'DISMISSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint

-- ── KYC: Didit decision snapshot ───────────────────────────────────────────
ALTER TABLE "kyc_documents" ADD COLUMN IF NOT EXISTS "diditDecisionPayload" json;--> statement-breakpoint

-- ── PEE leads: upgrade legacy table → payment + CRM columns ─────────────────
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "referenceNumber" text;--> statement-breakpoint
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "montantCfa" numeric(15, 2);--> statement-breakpoint
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "providerTransactionId" text;--> statement-breakpoint
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "providerStatus" text;--> statement-breakpoint
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "paymentCallbackPayload" json;--> statement-breakpoint
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "paymentInitiatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "paymentCompletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "pee_leads" ADD COLUMN IF NOT EXISTS "crmStatus" "PeeCrmStatus";--> statement-breakpoint

-- Backfill reference numbers before NOT NULL / UNIQUE
UPDATE "pee_leads"
SET "referenceNumber" = 'PEE-LEGACY-' || "id"
WHERE "referenceNumber" IS NULL;--> statement-breakpoint

UPDATE "pee_leads"
SET "montantCfa" = 0
WHERE "montantCfa" IS NULL;--> statement-breakpoint

-- Migrate legacy text CRM statuses into crmStatus; payment status → PENDING
UPDATE "pee_leads"
SET
  "crmStatus" = CASE
    WHEN "status"::text IN ('NEW', 'CONTACTED', 'CONVERTED', 'DISMISSED') THEN ("status"::text)::"PeeCrmStatus"
    ELSE COALESCE("crmStatus", 'NEW'::"PeeCrmStatus")
  END,
  "status" = 'PENDING'::"PeeSubscriptionStatus"
WHERE "status"::text IN ('NEW', 'CONTACTED', 'CONVERTED', 'DISMISSED')
   OR "status" IS NULL;--> statement-breakpoint

-- Rows already on payment enum keep crmStatus null (paid subscriptions)
UPDATE "pee_leads"
SET "status" = 'PENDING'::"PeeSubscriptionStatus"
WHERE "status"::text NOT IN (
  'PENDING', 'PAYMENT_INITIATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'CANCELLED'
)
AND "status"::text NOT IN ('NEW', 'CONTACTED', 'CONVERTED', 'DISMISSED');--> statement-breakpoint

-- Convert status column to PeeSubscriptionStatus when still text/varchar
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pee_leads'
      AND column_name = 'status'
      AND udt_name <> 'PeeSubscriptionStatus'
  ) THEN
    ALTER TABLE "pee_leads" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "pee_leads"
      ALTER COLUMN "status" TYPE "PeeSubscriptionStatus"
      USING ("status"::text)::"PeeSubscriptionStatus";
    ALTER TABLE "pee_leads"
      ALTER COLUMN "status" SET DEFAULT 'PENDING'::"PeeSubscriptionStatus";
  END IF;
END $$;--> statement-breakpoint

ALTER TABLE "pee_leads" ALTER COLUMN "referenceNumber" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pee_leads" ALTER COLUMN "montantCfa" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pee_leads" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'pee_leads_referenceNumber_unique'
  ) THEN
    ALTER TABLE "pee_leads" ADD CONSTRAINT "pee_leads_referenceNumber_unique" UNIQUE ("referenceNumber");
  END IF;
END $$;
