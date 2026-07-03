-- Sama Naffa field agents (in-field acquisition attribution, no rewards)
DO $$ BEGIN
  CREATE TYPE "FieldAgentStatus" AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "field_agents" (
  "id" text PRIMARY KEY NOT NULL,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "phone" text,
  "email" text,
  "region" text,
  "status" "FieldAgentStatus" DEFAULT 'ACTIVE' NOT NULL,
  "createdBy" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "field_agents_code_unique" UNIQUE("code")
);

DO $$ BEGIN
  ALTER TABLE "field_agents"
    ADD CONSTRAINT "field_agents_createdBy_admin_users_id_fk"
    FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "referredByAgentId" text;

DO $$ BEGIN
  ALTER TABLE "users"
    ADD CONSTRAINT "users_referredByAgentId_field_agents_id_fk"
    FOREIGN KEY ("referredByAgentId") REFERENCES "field_agents"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "users_referred_by_agent_idx" ON "users" ("referredByAgentId");
