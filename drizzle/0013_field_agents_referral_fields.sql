-- Sama Naffa referral codes: parity with legacy sponsor-code fields
ALTER TABLE "field_agents" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "field_agents" ADD COLUMN IF NOT EXISTS "usageCount" integer NOT NULL DEFAULT 0;
ALTER TABLE "field_agents" ADD COLUMN IF NOT EXISTS "maxUsage" integer;
ALTER TABLE "field_agents" ADD COLUMN IF NOT EXISTS "expiresAt" timestamp;

-- Align status with SponsorCodeStatus (ACTIVE / INACTIVE / EXPIRED)
ALTER TABLE "field_agents" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "field_agents"
  ALTER COLUMN "status" TYPE "SponsorCodeStatus"
  USING ("status"::text::"SponsorCodeStatus");
ALTER TABLE "field_agents" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

DROP TYPE IF EXISTS "FieldAgentStatus";
