# Drizzle migration tracker

**Goal:** Remove `@/lib/prisma` shim (`src/lib/db/helpers.ts` Prisma-compatible layer) and use native Drizzle queries everywhere.

**Source of truth:** `src/lib/db/schema.ts` + `drizzle/*.sql`

**Status (2026-06-22):** All `src/` callers migrated — zero `import { prisma } from '@/lib/prisma'` in application code.

---

## Done (native Drizzle)

### Core lib

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

### Auth & notifications API

| File | Notes |
|------|--------|
| `src/app/api/auth/check-availability/route.ts` | email uniqueness |
| `src/app/api/auth/send-otp/route.ts` | registration sessions, OTP |
| `src/app/api/auth/dev-mock-otp-hint/route.ts` | OTP dev hint |
| `src/app/api/notifications/route.ts` | list + admin create |
| `src/app/api/notifications/[id]/route.ts` | CRUD |

### Onboarding

| File | Notes |
|------|--------|
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

### Portal / users

| File | Notes |
|------|--------|
| `src/app/api/users/profile/route.ts` | profile GET/PUT + accounts/KYC |
| `src/app/api/portal/profile/complete/route.ts` | post-KYC communications |
| `src/app/api/accounts/route.ts` | list/create Sama Naffa accounts |

### Transactions / payments

| File | Notes |
|------|--------|
| `src/app/api/transactions/route.ts` | lookup by reference/id |
| `src/app/api/transactions/intent/route.ts` | create/list intents |
| `src/app/api/payments/intouch/callback/route.ts` | Intouch webhook + `db.transaction` |
| `src/app/api/payments/intouch/manual-callback/route.ts` | redirect fallback |

### KYC / webhooks

| File | Notes |
|------|--------|
| `src/app/api/kyc/upload/route.ts` | blob upload + KYC docs |
| `src/app/api/webhooks/didit/route.ts` | Didit webhook → `syncDiditDecision` |

### Admin API

| File | Notes |
|------|--------|
| `src/app/api/admin/auth/login/route.ts` | admin login |
| `src/app/api/admin/dashboard-config/route.ts` | `dashboardCards` CRUD |
| `src/app/api/admin/users/route.ts` | paginated user list |
| `src/app/api/admin/users/[id]/route.ts` | suspend/activate (account status) |
| `src/app/api/admin/users/[id]/kyc/route.ts` | manual KYC status |
| `src/app/api/admin/kyc/route.ts` | KYC document list |
| `src/app/api/admin/kyc/[id]/route.ts` | document verification |
| `src/app/api/admin/kyc/batch/route.ts` | batch document updates |
| `src/app/api/admin/transactions/route.ts` | admin transaction list |
| `src/app/api/admin/transactions/[id]/route.ts` | status + balance adjust |
| `src/app/api/admin/notifications/route.ts` | admin notification feed |
| `src/app/api/admin/settings/notifications/route.ts` | settings (in-memory) |
| `src/app/api/admin/sponsor-codes/route.ts` | sponsor code CRUD |
| `src/app/api/admin/ape-subscriptions/route.ts` | APE subscription list/export |
| `src/app/api/admin/accounts/recalculate-balances/route.ts` | balance reconciliation |

---

## Final cleanup (next)

- [ ] Grep repo for any remaining `@/lib/prisma` or `helpers.ts` shim usage (scripts, tests, seed).
- [ ] Delete Prisma-compatible exports from `src/lib/db/helpers.ts` (or split into domain repos).
- [ ] Delete `src/lib/prisma.ts`.
- [ ] Rewrite `prisma/seed.ts` with Drizzle or remove.
- [ ] Archive `prisma/migrations/` (historical reference only).
- [ ] Remove `db:seed` Prisma script from `package.json` if unused.

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
