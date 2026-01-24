# Better Auth Migration Issues

## Date: 2026-01-24

## Objective
Migrate normal user authentication from custom JWT to Better Auth native endpoints while keeping admin JWT auth separate.

## Current Status: ⚠️ BLOCKED

### Problem
Database connection mismatch - app connects to wrong database instance.

## Detailed Issues

### 1. Database Connection Problem
**Symptom:** `error: relation "user" does not exist`

**Root Cause:** The application's `process.env.DATABASE_URL` points to a different database than the shell's `$DATABASE_URL`.

**Evidence:**
- Shell command `psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"user\""` ✅ Works (returns 1 row)
- App runtime query to `user` table ❌ Fails with "relation does not exist"
- Both `.env.local` files appear to have same DATABASE_URL but app can't find the table

**Possible Causes:**
1. Environment variable not loaded correctly in Vite/TanStack Start
2. Multiple DATABASE_URL definitions conflicting
3. Dotenv loading timing issue
4. Different database branches/instances in Neon

### 2. Migration Applied Successfully
The database schema was successfully updated:
- ✅ Added all Better Auth required columns to `user` table
- ✅ Table renamed from `users` to `user` (singular)
- ✅ Columns use snake_case (`first_name`, `password_hash`, etc.)
- ✅ `session`, `account`, `verification` tables exist

### 3. Code Updates Completed
All code changes for Better Auth integration are complete:
- ✅ Schema updated to match Better Auth expectations
- ✅ AuthProvider uses `authClient.signIn.email()`
- ✅ Deprecated custom auth endpoints removed
- ✅ TypeScript compilation passes
- ✅ Nullable fields handled correctly

## Files Modified

### Schema Files
- `apps/web/src/lib/db/schema.ts` - Updated to Better Auth core schema (singular tables, snake_case)
- `apps/web/src/lib/db/auth-schema.ts` - Simplified to re-export from main schema
- `drizzle.config.ts` - Fixed schema path

### Auth Configuration
- `apps/web/src/lib/better-auth.ts` - Added native password hashing, verification table
- `apps/web/src/components/providers/AuthProvider.tsx` - Uses Better Auth native `signIn.email()`
- `apps/web/src/lib/auth.ts` - Removed deprecated `verifyCredentials` export

### Session Management
- `apps/web/src/lib/auth-session.ts` - Updated for snake_case columns, nullable fields
- `apps/web/src/lib/get-session.ts` - Updated for snake_case columns, nullable fields
- `apps/web/src/lib/db/helpers.ts` - Updated session helper for new schema

### API Routes
- `apps/web/src/app/api/auth/sign-out.ts` - Uses `session.token` instead of `sessionToken`
- `apps/web/src/app/api/auth/verify-otp.ts` - Fixed nullable phone field
- `apps/web/src/app/api/users/profile/route.ts` - Fixed table name from `users` to `user`
- Deleted: `apps/web/src/app/api/auth/sign-in/credentials.ts` (deprecated)

### Database
- `drizzle/0007_migrate_to_better_auth_core_schema.sql` - Migration SQL (partially applied)
- Direct SQL commands executed to add columns to `user` table

## Next Steps to Resolve

### Immediate Actions
1. **Debug DATABASE_URL loading**
   - Add more logging to see exact connection string being used
   - Check if Vite is loading `.env.local` correctly
   - Verify TanStack Start environment variable handling

2. **Verify Database Instance**
   - Check Neon dashboard for multiple database branches
   - Confirm which database has the `user` table with all columns
   - Ensure app and shell point to same instance

3. **Test Connection Directly**
   - Create standalone script to test DB connection
   - Verify schema matches expectations
   - Test Better Auth adapter connection

### Alternative Approaches
1. **Use single DATABASE_URL** - Consolidate to one clear database URL
2. **Fresh migration** - Apply migration to the database the app IS connecting to
3. **Environment variable override** - Explicitly set DATABASE_URL in code for testing

## Technical Details

### Expected Schema (Better Auth Core)
```sql
-- user table (singular, snake_case)
CREATE TABLE "user" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  -- App-specific fields
  phone text UNIQUE,
  first_name text,
  last_name text,
  password_hash text,
  kyc_status text DEFAULT 'PENDING',
  -- ... other fields
);

-- session table (singular, snake_case)
CREATE TABLE "session" (
  id text PRIMARY KEY,
  token text NOT NULL UNIQUE,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text
);

-- account table (singular, snake_case)
CREATE TABLE "account" (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  provider_id text NOT NULL,
  account_id text NOT NULL,
  -- ... other fields
);

-- verification table
CREATE TABLE "verification" (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
```

### Auth Flow Design
- **Normal Users** (`/login`) → Better Auth native endpoints (`authClient.signIn.email()`)
- **Admin Users** (`/admin/login`) → Separate JWT system (unchanged)

## Commit Message (When Ready)
```
feat(auth): migrate normal user auth to better-auth native endpoints

BREAKING CHANGE: Normal user authentication now uses Better Auth native
endpoints instead of custom JWT. Admin authentication remains unchanged.

- Update schema to Better Auth core (singular table names, snake_case)
- Switch AuthProvider to use authClient.signIn.email()
- Remove deprecated custom credentials endpoint
- Add all app-specific fields to Better Auth user table
- Fix nullable field handling throughout codebase

Issue: Database connection mismatch preventing runtime execution
```

## Status: Ready for Checkpoint ✅
All code changes complete. Blocked on database connection issue that needs investigation.
