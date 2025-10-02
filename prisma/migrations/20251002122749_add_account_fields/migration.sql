-- AlterTable
ALTER TABLE "public"."user_accounts" ADD COLUMN     "allowAdditionalDeposits" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "interestRate" DECIMAL(15,2),
ADD COLUMN     "lockPeriodMonths" INTEGER,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "productName" TEXT;
