-- Add form draft status enum
DO $$ BEGIN
    CREATE TYPE "FormDraftStatus" AS ENUM('ABANDONED', 'CONTACTED', 'CONVERTED', 'DISMISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create form drafts table
CREATE TABLE IF NOT EXISTS "form_drafts" (
    "id" text PRIMARY KEY NOT NULL,
    "anonymousId" text NOT NULL,
    "formType" text NOT NULL,
    "draftData" jsonb NOT NULL,
    "email" text,
    "phone" text,
    "stepReached" text,
    "fieldsCompleted" integer,
    "totalFields" integer,
    "source" jsonb,
    "deviceInfo" jsonb,
    "score" integer NOT NULL DEFAULT 0,
    "status" "FormDraftStatus" NOT NULL DEFAULT 'ABANDONED',
    "adminNotes" text,
    "firstSeenAt" timestamp NOT NULL DEFAULT now(),
    "lastActivityAt" timestamp NOT NULL DEFAULT now(),
    "convertedAt" timestamp
);

-- Create form events table
CREATE TABLE IF NOT EXISTS "form_events" (
    "id" text PRIMARY KEY NOT NULL,
    "anonymousId" text NOT NULL,
    "formType" text NOT NULL,
    "eventType" text NOT NULL,
    "fieldKey" text,
    "step" text,
    "metadata" jsonb,
    "createdAt" timestamp NOT NULL DEFAULT now()
);

-- Indexes for form drafts
CREATE UNIQUE INDEX IF NOT EXISTS "form_drafts_anonymous_form_type_unique" ON "form_drafts" ("anonymousId", "formType");
CREATE INDEX IF NOT EXISTS "form_drafts_status_idx" ON "form_drafts" ("formType", "status");
CREATE INDEX IF NOT EXISTS "form_drafts_email_idx" ON "form_drafts" ("email");
CREATE INDEX IF NOT EXISTS "form_drafts_phone_idx" ON "form_drafts" ("phone");
CREATE INDEX IF NOT EXISTS "form_drafts_score_idx" ON "form_drafts" ("score");

-- Indexes for form events
CREATE INDEX IF NOT EXISTS "form_events_anon_form_idx" ON "form_events" ("anonymousId", "formType");
CREATE INDEX IF NOT EXISTS "form_events_event_time_idx" ON "form_events" ("eventType", "createdAt");
