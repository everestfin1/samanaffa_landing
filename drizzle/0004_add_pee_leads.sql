-- Create PEE leads table
CREATE TABLE IF NOT EXISTS "pee_leads" (
    "id" text PRIMARY KEY NOT NULL,
    "civilite" text NOT NULL,
    "prenom" text NOT NULL,
    "nom" text NOT NULL,
    "categorie" text NOT NULL,
    "pays" text NOT NULL,
    "ville" text NOT NULL,
    "telephone" text NOT NULL,
    "email" text,
    "status" text NOT NULL DEFAULT 'NEW',
    "adminNotes" text,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS "pee_leads_status_idx" ON "pee_leads" ("status");
CREATE INDEX IF NOT EXISTS "pee_leads_created_at_idx" ON "pee_leads" ("createdAt");
CREATE INDEX IF NOT EXISTS "pee_leads_telephone_idx" ON "pee_leads" ("telephone");
