CREATE TABLE IF NOT EXISTS "onboarding_account_settings" (
  "id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
  "productCode" text DEFAULT 'SN-DEFAULT' NOT NULL,
  "productName" text DEFAULT 'Sama Naffa' NOT NULL,
  "interestRate" numeric(5, 2) DEFAULT '4.50' NOT NULL,
  "lockPeriodMonths" integer DEFAULT 12 NOT NULL,
  "allowAdditionalDeposits" boolean DEFAULT true NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "onboarding_account_settings" ("id")
VALUES ('default')
ON CONFLICT ("id") DO NOTHING;
