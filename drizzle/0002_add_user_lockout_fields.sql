ALTER TABLE "users" ADD COLUMN "failedAttempts" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN "lockedUntil" timestamp(3);
