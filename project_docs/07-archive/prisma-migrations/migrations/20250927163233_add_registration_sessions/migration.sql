-- CreateEnum
CREATE TYPE "public"."SessionType" AS ENUM ('REGISTRATION', 'LOGIN');

-- CreateTable
CREATE TABLE "public"."registration_sessions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "type" "public"."SessionType" NOT NULL DEFAULT 'REGISTRATION',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_sessions_pkey" PRIMARY KEY ("id")
);
