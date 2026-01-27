DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Country') THEN
    CREATE TYPE "Country" AS ENUM ('SENEGAL', 'TOGO');
  END IF;
END $$;

ALTER TABLE "ape_subscriptions"
  ADD COLUMN IF NOT EXISTS "country" "Country" NOT NULL DEFAULT 'SENEGAL';
