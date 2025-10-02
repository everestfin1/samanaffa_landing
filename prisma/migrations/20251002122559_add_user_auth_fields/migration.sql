-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "otpVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT;
