-- Add sponsor code status enum
DO $$ BEGIN
    CREATE TYPE "SponsorCodeStatus" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create APE sponsor codes table
CREATE TABLE IF NOT EXISTS "ape_sponsor_codes" (
    "id" text PRIMARY KEY NOT NULL,
    "code" text NOT NULL UNIQUE,
    "description" text,
    "createdBy" text NOT NULL REFERENCES "admin_users"("id") ON DELETE CASCADE,
    "status" "SponsorCodeStatus" NOT NULL DEFAULT 'ACTIVE',
    "usageCount" integer NOT NULL DEFAULT 0,
    "maxUsage" integer,
    "expiresAt" timestamp,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS "ape_sponsor_codes_code_idx" ON "ape_sponsor_codes" ("code");
CREATE INDEX IF NOT EXISTS "ape_sponsor_codes_status_idx" ON "ape_sponsor_codes" ("status");
