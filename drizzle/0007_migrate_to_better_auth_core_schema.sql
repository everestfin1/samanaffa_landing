-- Migrate to Better Auth core schema
-- This migration renames tables to singular names and adds missing columns/tables required by Better Auth

-- 1. Rename tables to singular names (Better Auth expects: user, session, account, verification)
ALTER TABLE IF EXISTS users RENAME TO user;
ALTER TABLE IF EXISTS sessions RENAME TO session;
ALTER TABLE IF EXISTS accounts RENAME TO account;

-- 2. Add missing columns to 'user' table required by Better Auth
DO $$
BEGIN
    -- Add name column (required by Better Auth) - combine firstName + lastName
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'name') THEN
        ALTER TABLE "user" ADD COLUMN "name" text NOT NULL DEFAULT '';
    END IF;

    -- Add emailVerified column (required by Better Auth) - snake_case
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'email_verified') THEN
        ALTER TABLE "user" ADD COLUMN "email_verified" boolean NOT NULL DEFAULT false;
    END IF;

    -- Add image column (optional, required by Better Auth schema)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'image') THEN
        ALTER TABLE "user" ADD COLUMN "image" text;
    END IF;

    -- Add created_at column (snake_case, required by Better Auth)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'created_at') THEN
        ALTER TABLE "user" ADD COLUMN "created_at" timestamp NOT NULL DEFAULT now();
    END IF;

    -- Add updated_at column (snake_case, required by Better Auth)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'updated_at') THEN
        ALTER TABLE "user" ADD COLUMN "updated_at" timestamp NOT NULL DEFAULT now();
    END IF;

    -- Rename existing columns to snake_case if they don't match
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'firstName') THEN
        ALTER TABLE "user" RENAME COLUMN "firstName" TO "first_name";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'lastName') THEN
        ALTER TABLE "user" RENAME COLUMN "lastName" TO "last_name";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'passwordHash') THEN
        ALTER TABLE "user" RENAME COLUMN "passwordHash" TO "password_hash";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'kycStatus') THEN
        ALTER TABLE "user" RENAME COLUMN "kycStatus" TO "kyc_status";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'dateOfBirth') THEN
        ALTER TABLE "user" RENAME COLUMN "dateOfBirth" TO "date_of_birth";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'idExpiryDate') THEN
        ALTER TABLE "user" RENAME COLUMN "idExpiryDate" TO "id_expiry_date";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'idIssueDate') THEN
        ALTER TABLE "user" RENAME COLUMN "idIssueDate" TO "id_issue_date";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'idNumber') THEN
        ALTER TABLE "user" RENAME COLUMN "idNumber" TO "id_number";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'idType') THEN
        ALTER TABLE "user" RENAME COLUMN "idType" TO "id_type";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'preferredLanguage') THEN
        ALTER TABLE "user" RENAME COLUMN "preferredLanguage" TO "preferred_language";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'emailVerified') THEN
        ALTER TABLE "user" RENAME COLUMN "emailVerified" TO "email_verified";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'phoneVerified') THEN
        ALTER TABLE "user" RENAME COLUMN "phoneVerified" TO "phone_verified";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'otpVerifiedAt') THEN
        ALTER TABLE "user" RENAME COLUMN "otpVerifiedAt" TO "otp_verified_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'createdAt') THEN
        ALTER TABLE "user" RENAME COLUMN "createdAt" TO "created_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'updatedAt') THEN
        ALTER TABLE "user" RENAME COLUMN "updatedAt" TO "updated_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'failedAttempts') THEN
        ALTER TABLE "user" RENAME COLUMN "failedAttempts" TO "failed_attempts";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'lockedUntil') THEN
        ALTER TABLE "user" RENAME COLUMN "lockedUntil" TO "locked_until";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'marketingAccepted') THEN
        ALTER TABLE "user" RENAME COLUMN "marketingAccepted" TO "marketing_accepted";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'privacyAccepted') THEN
        ALTER TABLE "user" RENAME COLUMN "privacyAccepted" TO "privacy_accepted";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'termsAccepted') THEN
        ALTER TABLE "user" RENAME COLUMN "termsAccepted" TO "terms_accepted";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'domaineActivite') THEN
        ALTER TABLE "user" RENAME COLUMN "domaineActivite" TO "domaine_activite";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'placeOfBirth') THEN
        ALTER TABLE "user" RENAME COLUMN "placeOfBirth" TO "place_of_birth";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user' AND column_name = 'statutEmploi') THEN
        ALTER TABLE "user" RENAME COLUMN "statutEmploi" TO "statut_emploi";
    END IF;
END $$;

-- 3. Update name column with firstName + lastName for existing records
UPDATE "user" SET name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') WHERE name = '';

-- 4. Add missing columns to 'session' table required by Better Auth
DO $$
BEGIN
    -- Rename columns to snake_case if they don't match
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'sessionToken') THEN
        ALTER TABLE "session" RENAME COLUMN "sessionToken" TO "token";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'userId') THEN
        ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'expires') THEN
        ALTER TABLE "session" RENAME COLUMN "expires" TO "expires_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'createdAt') THEN
        ALTER TABLE "session" RENAME COLUMN "createdAt" TO "created_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'updatedAt') THEN
        ALTER TABLE "session" RENAME COLUMN "updatedAt" TO "updated_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'ipAddress') THEN
        ALTER TABLE "session" RENAME COLUMN "ipAddress" TO "ip_address";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'userAgent') THEN
        ALTER TABLE "session" RENAME COLUMN "userAgent" TO "user_agent";
    END IF;

    -- Add missing columns required by Better Auth
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'id') THEN
        ALTER TABLE "session" ADD COLUMN "id" text NOT NULL DEFAULT gen_random_uuid();
        ALTER TABLE "session" ADD PRIMARY KEY ("id");
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'token') THEN
        ALTER TABLE "session" ADD COLUMN "token" text NOT NULL UNIQUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'expires_at') THEN
        ALTER TABLE "session" ADD COLUMN "expires_at" timestamp NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'created_at') THEN
        ALTER TABLE "session" ADD COLUMN "created_at" timestamp NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'updated_at') THEN
        ALTER TABLE "session" ADD COLUMN "updated_at" timestamp NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'ip_address') THEN
        ALTER TABLE "session" ADD COLUMN "ip_address" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'user_agent') THEN
        ALTER TABLE "session" ADD COLUMN "user_agent" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session' AND column_name = 'user_id') THEN
        ALTER TABLE "session" ADD COLUMN "user_id" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Add index for session user_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'session' AND indexname = 'session_userId_idx') THEN
        CREATE INDEX "session_userId_idx" ON "session"("user_id");
    END IF;
END $$;

-- 6. Add missing columns to 'account' table required by Better Auth
DO $$
BEGIN
    -- Rename columns to snake_case if they don't match
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'userId') THEN
        ALTER TABLE "account" RENAME COLUMN "userId" TO "user_id";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'providerId') THEN
        ALTER TABLE "account" RENAME COLUMN "providerId" TO "provider_id";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'accountId') THEN
        ALTER TABLE "account" RENAME COLUMN "accountId" TO "account_id";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'accessToken') THEN
        ALTER TABLE "account" RENAME COLUMN "accessToken" TO "access_token";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'refreshToken') THEN
        ALTER TABLE "account" RENAME COLUMN "refreshToken" TO "refresh_token";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'idToken') THEN
        ALTER TABLE "account" RENAME COLUMN "idToken" TO "id_token";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'accessTokenExpiresAt') THEN
        ALTER TABLE "account" RENAME COLUMN "accessTokenExpiresAt" TO "access_token_expires_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'refreshTokenExpiresAt') THEN
        ALTER TABLE "account" RENAME COLUMN "refreshTokenExpiresAt" TO "refresh_token_expires_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'createdAt') THEN
        ALTER TABLE "account" RENAME COLUMN "createdAt" TO "created_at";
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'updatedAt') THEN
        ALTER TABLE "account" RENAME COLUMN "updatedAt" TO "updated_at";
    END IF;

    -- Add missing columns required by Better Auth
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'id') THEN
        ALTER TABLE "account" ADD COLUMN "id" text NOT NULL DEFAULT gen_random_uuid();
        ALTER TABLE "account" ADD PRIMARY KEY ("id");
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'account_id') THEN
        ALTER TABLE "account" ADD COLUMN "account_id" text NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'provider_id') THEN
        ALTER TABLE "account" ADD COLUMN "provider_id" text NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'user_id') THEN
        ALTER TABLE "account" ADD COLUMN "user_id" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'access_token') THEN
        ALTER TABLE "account" ADD COLUMN "access_token" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'refresh_token') THEN
        ALTER TABLE "account" ADD COLUMN "refresh_token" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'id_token') THEN
        ALTER TABLE "account" ADD COLUMN "id_token" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'access_token_expires_at') THEN
        ALTER TABLE "account" ADD COLUMN "access_token_expires_at" timestamp;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'refresh_token_expires_at') THEN
        ALTER TABLE "account" ADD COLUMN "refresh_token_expires_at" timestamp;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'scope') THEN
        ALTER TABLE "account" ADD COLUMN "scope" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'password') THEN
        ALTER TABLE "account" ADD COLUMN "password" text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'created_at') THEN
        ALTER TABLE "account" ADD COLUMN "created_at" timestamp NOT NULL DEFAULT now();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'account' AND column_name = 'updated_at') THEN
        ALTER TABLE "account" ADD COLUMN "updated_at" timestamp NOT NULL DEFAULT now();
    END IF;
END $$;

-- 7. Add indexes for account table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'account' AND indexname = 'account_userId_idx') THEN
        CREATE INDEX "account_userId_idx" ON "account"("user_id");
    END IF;
END $$;

-- 8. Create verification table (required by Better Auth)
CREATE TABLE IF NOT EXISTS verification (
    id text NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- 9. Add index for verification table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'verification' AND indexname = 'verification_identifier_idx') THEN
        CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
    END IF;
END $$;

-- 10. Update Better Auth configuration to use the new schema
-- This will be done in the next step (code changes)
