ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "sessionVersion" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE "users"
SET "sessionVersion" = GREATEST(
  COALESCE(
    CASE
      WHEN "investorProfile" IS NOT NULL
        AND ("investorProfile"::jsonb ? 'sessionVersion')
      THEN (("investorProfile"::jsonb->>'sessionVersion')::integer)
      ELSE 0
    END,
    0
  ),
  0
)
WHERE "investorProfile" IS NOT NULL
  AND ("investorProfile"::jsonb ? 'sessionVersion');
