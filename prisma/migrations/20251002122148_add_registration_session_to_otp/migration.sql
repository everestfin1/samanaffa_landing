-- AlterTable
ALTER TABLE "public"."otp_codes" ADD COLUMN     "registrationSessionId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."otp_codes" ADD CONSTRAINT "otp_codes_registrationSessionId_fkey" FOREIGN KEY ("registrationSessionId") REFERENCES "public"."registration_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
