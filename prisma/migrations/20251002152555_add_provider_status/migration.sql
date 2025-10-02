-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('KYC_STATUS', 'SUCCESS', 'ERROR', 'WARNING', 'TRANSACTION', 'SECURITY');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "public"."transaction_intents" ADD COLUMN     "lastCallbackAt" TIMESTAMP(3),
ADD COLUMN     "lastCallbackPayload" JSONB,
ADD COLUMN     "providerStatus" TEXT;

-- CreateTable
CREATE TABLE "public"."payment_callback_logs" (
    "id" TEXT NOT NULL,
    "transactionIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_callback_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "priority" "public"."NotificationPriority" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."payment_callback_logs" ADD CONSTRAINT "payment_callback_logs_transactionIntentId_fkey" FOREIGN KEY ("transactionIntentId") REFERENCES "public"."transaction_intents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
