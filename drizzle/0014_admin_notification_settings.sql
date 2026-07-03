CREATE TABLE IF NOT EXISTS "admin_notification_settings" (
  "id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
  "enableEmailNotifications" boolean DEFAULT true NOT NULL,
  "enableSMSNotifications" boolean DEFAULT false NOT NULL,
  "enableKYCApprovalSMS" boolean DEFAULT false NOT NULL,
  "enableKYCRejectionSMS" boolean DEFAULT true NOT NULL,
  "enableKYCUnderReviewSMS" boolean DEFAULT false NOT NULL,
  "enableTransactionSMS" boolean DEFAULT false NOT NULL,
  "smsOnlyForCritical" boolean DEFAULT true NOT NULL,
  "emailTemplate" text DEFAULT 'default' NOT NULL,
  "smsTemplate" text DEFAULT 'default' NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "admin_notification_settings" ("id")
VALUES ('default')
ON CONFLICT ("id") DO NOTHING;
