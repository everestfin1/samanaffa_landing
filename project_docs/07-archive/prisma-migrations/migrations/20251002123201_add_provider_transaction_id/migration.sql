/*
  Warnings:

  - A unique constraint covering the columns `[providerTransactionId]` on the table `transaction_intents` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."transaction_intents" ADD COLUMN     "providerTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_intents_providerTransactionId_key" ON "public"."transaction_intents"("providerTransactionId");
