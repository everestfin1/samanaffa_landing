-- Add adminNotes to APE subscriptions table
ALTER TABLE "ape_subscriptions" ADD COLUMN IF NOT EXISTS "adminNotes" text;

-- Index for searching/filtering notes if needed
CREATE INDEX IF NOT EXISTS "ape_subscriptions_admin_notes_idx" ON "ape_subscriptions" ("adminNotes");
