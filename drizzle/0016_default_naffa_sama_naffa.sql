-- Rename the default onboarding product label from "Naffa Classique" to "Sama Naffa".
ALTER TABLE "onboarding_account_settings"
  ALTER COLUMN "productName" SET DEFAULT 'Sama Naffa';

UPDATE "onboarding_account_settings"
SET "productName" = 'Sama Naffa',
    "updatedAt" = now()
WHERE "id" = 'default'
  AND "productName" = 'Naffa Classique';

-- Accounts opened under the previous default keep the old label otherwise.
UPDATE "user_accounts"
SET "productName" = 'Sama Naffa'
WHERE "accountType" = 'SAMA_NAFFA'
  AND "productCode" = 'SN-DEFAULT'
  AND "productName" = 'Naffa Classique';
