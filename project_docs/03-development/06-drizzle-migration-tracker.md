# Drizzle migration tracker

**Goal:** Remove `@/lib/prisma` shim (`src/lib/db/helpers.ts` Prisma-compatible layer) and use native Drizzle queries everywhere.

**Source of truth:** `src/lib/db/schema.ts` + `drizzle/*.sql`

---

## Done (native Drizzle)

| File | Notes |
|------|--------|
| `src/lib/user-notifications.ts` | `notifications` insert |
| `src/lib/sponsor-code.ts` | `apeSponsorCodes` |
| `src/lib/auth-session.ts` | `users.sessionVersion` |
| `src/lib/post-signup-token.ts` | `users`, `userAccounts` |
| `src/lib/audit-logger.ts` | `adminAuditLogs` + admin join |
| `src/lib/admin-auth.ts` | `adminUsers` |
| `src/lib/didit-kyc-bypass.ts` | `users`, `kycDocuments` |
| `src/lib/otp.ts` | `otpCodes`, `users`, registration sessions |
| `src/lib/auth.ts` | NextAuth + `users` lookups |
| `src/lib/kyc-sync.ts` | `kycDocuments`, `users` |
| `src/app/api/auth/check-availability/route.ts` | email uniqueness |
| `src/app/api/auth/send-otp/route.ts` | registration sessions, OTP |
| `src/app/api/auth/dev-mock-otp-hint/route.ts` | OTP dev hint |
| `src/app/api/notifications/route.ts` | list + admin create |
| `src/app/api/notifications/[id]/route.ts` | CRUD |
| `src/app/api/onboarding/create-account/route.ts` | T1 phone signup |
| `src/app/api/onboarding/profile/route.ts` | user profile patch |
| `src/app/api/onboarding/progress/route.ts` | onboarding step state |
| `src/app/api/onboarding/apply-formula/route.ts` | Sama Naffa product |
| `src/app/api/onboarding/deposit-intent/route.ts` | T4 deposit intent |
| `src/app/api/onboarding/pending-deposit/route.ts` | pending deposit CRUD |
| `src/app/api/onboarding/release-deposit/route.ts` | post-KYC release |
| `src/app/api/onboarding/kyc/start/route.ts` | Didit session create |
| `src/app/api/onboarding/kyc/session-url/route.ts` | Didit URL reuse |
| `src/app/api/onboarding/kyc/status/route.ts` | Didit status poll |

---

## Remaining (still `import { prisma } from '@/lib/prisma'`)

### Portal / users

- [ ] `src/app/api/users/profile/route.ts`
- [ ] `src/app/api/portal/profile/complete/route.ts`
- [ ] `src/app/api/accounts/route.ts`

### Transactions / payments

- [ ] `src/app/api/transactions/route.ts`
- [ ] `src/app/api/transactions/intent/route.ts`
- [ ] `src/app/api/payments/intouch/callback/route.ts` (large)
- [ ] `src/app/api/payments/intouch/manual-callback/route.ts`

### KYC / webhooks

- [ ] `src/app/api/kyc/upload/route.ts`
- [ ] `src/app/api/webhooks/didit/route.ts`

### Admin API

- [ ] `src/app/api/admin/auth/login/route.ts`
- [ ] `src/app/api/admin/dashboard-config/route.ts`
- [ ] `src/app/api/admin/users/route.ts`
- [ ] `src/app/api/admin/users/[id]/route.ts`
- [ ] `src/app/api/admin/users/[id]/kyc/route.ts`
- [ ] `src/app/api/admin/kyc/route.ts`
- [ ] `src/app/api/admin/kyc/[id]/route.ts`
- [ ] `src/app/api/admin/kyc/batch/route.ts`
- [ ] `src/app/api/admin/transactions/route.ts`
- [ ] `src/app/api/admin/transactions/[id]/route.ts`
- [ ] `src/app/api/admin/notifications/route.ts`
- [ ] `src/app/api/admin/settings/notifications/route.ts`
- [ ] `src/app/api/admin/sponsor-codes/route.ts`
- [ ] `src/app/api/admin/ape-subscriptions/route.ts`
- [ ] `src/app/api/admin/accounts/recalculate-balances/route.ts`

---

## Final cleanup (after all callers migrated)

1. Delete Prisma-compatible exports from `src/lib/db/helpers.ts` (or split into domain repos).
2. Delete `src/lib/prisma.ts`.
3. Rewrite `prisma/seed.ts` with Drizzle or remove.
4. Archive `prisma/migrations/` (historical reference only).
5. Remove `db:seed` Prisma script from `package.json` if unused.

---

## Pattern

```typescript
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);

await db.update(users).set({ ...patch, updatedAt: new Date() }).where(eq(users.id, id));
```

For `$transaction`, use `db.transaction(async (tx) => { ... })`.
