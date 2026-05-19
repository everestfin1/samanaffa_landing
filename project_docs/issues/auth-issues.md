# Authentication & login — tracked issues

**Branch:** `feat/onboarding-flow-mock`  
**Recorded:** 2026-05-19  
**Source:** Login flow audit (NextAuth, OTP, onboarding auto-login, admin)  
**Scope:** `src/lib/auth.ts`, `src/app/login/`, `src/app/api/auth/*`, `src/app/api/onboarding/create-account/`, `src/proxy.ts`, `src/lib/otp.ts`, `src/lib/admin-auth.ts`

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

---

## Summary

| Severity | Open |
|----------|------|
| critical | 3 |
| high     | 4 |
| medium   | 5 |
| low      | 4 |

---

## Critical

### AUTH-001 — Password reset API does not require OTP proof
- **Status:** open
- **Area:** security
- **Files:** `src/app/api/auth/reset-password/route.ts`, `src/app/forgot-password/`
- **Problem:** `POST /api/auth/reset-password` accepts `email` or `phone` + `newPassword` only. The forgot-password UI calls `verify-otp` first, but the API does not check a reset token or recent OTP verification.
- **Impact:** Account takeover via direct API call without OTP.
- **Acceptance:** Reset only after verified OTP (single-use token issued by `verify-otp`, or reset performed in the same authenticated verify request).

### AUTH-002 — `signIn({ type: 'register' })` bypasses OTP re-verification
- **Status:** open
- **Area:** security
- **Files:** `src/lib/auth.ts`, `src/app/onboarding/page.tsx`
- **Problem:** After onboarding T1, client calls `signIn('credentials', { phone, type: 'register' })`. `authorize` only checks user exists and `userAccount.count >= 2` — no OTP or password.
- **Impact:** Anyone who knows a user’s phone (or email if wired) can obtain a 30-day JWT immediately after account creation.
- **Acceptance:** Post-signup session via one-time server token from `create-account`, or `signIn` with freshly verified OTP only; remove or harden `type: 'register'`.

### AUTH-003 — Setup password by raw `userId` without auth
- **Status:** open
- **Area:** security
- **Files:** `src/app/api/auth/setup-password/route.ts`, `src/app/setup-password/`
- **Problem:** `POST` accepts `{ userId, password }` with no session, OTP, or signed token.
- **Impact:** Attacker who guesses/obtains UUID can set password if user has none.
- **Acceptance:** Require authenticated session or time-limited signed token tied to registration/OTP flow.

---

## High

### AUTH-004 — OTP verification not rate-limited
- **Status:** open
- **Area:** security
- **Files:** `src/lib/otp.ts`, `src/lib/rate-limit.ts`, `src/app/api/auth/verify-otp/route.ts`, `src/app/api/onboarding/create-account/route.ts`
- **Problem:** Rate limits apply to `send-otp` only. Verify endpoints allow brute force of 6-digit codes within 5-minute window.
- **Acceptance:** Per-phone/session/IP limits on verify; lockout after N failures.

### AUTH-005 — OTP generated with `Math.random()`
- **Status:** open
- **Area:** security
- **Files:** `src/lib/otp.ts`
- **Problem:** 6-digit codes use non-cryptographic RNG.
- **Acceptance:** Use `crypto.randomInt` (or equivalent CSPRNG).

### AUTH-006 — CSRF protection does not apply to `/api` routes
- **Status:** open
- **Area:** security
- **Files:** `src/proxy.ts`, `src/lib/csrf.ts`
- **Problem:** Proxy matcher excludes `/api`; state-changing auth APIs are not CSRF-checked. Client does not send `x-csrf-token`.
- **Acceptance:** Enforce CSRF or SameSite + custom header pattern on mutating APIs; remove dead CSRF code or wire end-to-end.

### AUTH-014 — Admin JWT fallback secret
- **Status:** open
- **Area:** security
- **Files:** `src/lib/admin-auth.ts`
- **Problem:** `ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'`.
- **Acceptance:** Fail fast in production if secret unset; rotate docs for ops.

---

## Medium

### AUTH-007 — User enumeration on OTP send
- **Status:** open
- **Area:** security / ux
- **Files:** `src/app/api/auth/send-otp/route.ts`, `src/app/api/onboarding/create-account/route.ts`
- **Problem:** Login send returns `404 Utilisateur non trouvé`; onboarding returns `409` for existing phone — different signals.
- **Acceptance:** Generic responses (“If an account exists, we sent a code”) on all public OTP sends.

### AUTH-008 — Long-lived JWT without server revocation
- **Status:** open
- **Area:** security
- **Files:** `src/lib/auth.ts`
- **Problem:** JWT `maxAge` 30 days; no denylist on logout/password change.
- **Acceptance:** Shorter session for financial app, or token version on user row invalidated on password reset.

### AUTH-009 — `returnUrl` ignored after login
- **Status:** done
- **Area:** ux
- **Files:** `src/app/login/page.tsx`, e.g. `src/app/souscrire-ape/`
- **Problem:** Deep links pass `?returnUrl=…` but login always `router.push('/portal/dashboard')`.
- **Acceptance:** Honor allowlisted `returnUrl` / `callbackUrl` after successful sign-in.

### AUTH-013 — Duplicate OTP / signup pipelines
- **Status:** open
- **Area:** architecture
- **Files:** `src/app/api/auth/*`, `src/app/api/onboarding/create-account/route.ts`, `src/components/registration/*`
- **Problem:** Legacy `/api/auth/send-otp` + `verify-and-create-account` vs onboarding `create-account`; orphan registration wizard still in repo.
- **Acceptance:** Single signup path (`onboarding/create-account`); deprecate legacy APIs and remove unused UI.

### AUTH-015 — Admin routes not server-gated in proxy
- **Status:** open
- **Area:** security
- **Files:** `src/proxy.ts`, `src/app/admin/`
- **Problem:** Admin UI relies on `localStorage` JWT; proxy IP allowlist commented out; no JWT check on `/admin/*` pages.
- **Acceptance:** Validate admin JWT (or session) in proxy for `/admin` except login; prefer httpOnly cookie over `localStorage`.

### AUTH-016 — OTP / PII logged in verify-otp
- **Status:** open
- **Area:** security / ops
- **Files:** `src/app/api/auth/verify-otp/route.ts`, `src/lib/otp.ts`
- **Problem:** Debug `console.log` may include email, phone, OTP.
- **Acceptance:** Remove or redact in production; structured logging without secrets.

---

## Low

### AUTH-010 — `useSessionTimeout` never mounted
- **Status:** open
- **Area:** ux / security
- **Files:** `src/hooks/useSessionTimeout.ts` (or equivalent), portal layout
- **Problem:** Idle timeout hook exists but is not used in portal shell.
- **Acceptance:** Mount on portal layout or document intentional omission.

### AUTH-011 — `rememberMe` checkbox not wired
- **Status:** open
- **Area:** ux
- **Files:** `src/app/login/page.tsx`, `src/lib/auth.ts`
- **Problem:** UI collects `rememberMe` but NextAuth `maxAge` is fixed.
- **Acceptance:** Wire to session length or remove checkbox.

### AUTH-012 — Legacy registration components unused
- **Status:** open
- **Area:** maintenance
- **Files:** `src/components/registration/*`, `src/app/register/page.tsx` (redirect only)
- **Problem:** Full wizard orphaned; confuses developers and docs.
- **Acceptance:** Archive or delete; homepage links to `/onboarding`.

### AUTH-017 — `auto_login_failed` dead end after onboarding
- **Status:** open
- **Area:** ux
- **Files:** `src/app/onboarding/page.tsx`, `src/app/login/page.tsx`
- **Problem:** T1 `signIn` failure sends user to login with message; no link back to onboarding step.
- **Acceptance:** Deep link to `/onboarding` with resume hint or retry auto-login.

---

## Login flow reference

| Path | Entry | Session |
|------|--------|---------|
| Onboarding signup | `/onboarding` T1 → `create-account` → `signIn(register)` | JWT (see AUTH-002) |
| Portal password | `/login` → `signIn(login, password)` | JWT |
| Portal OTP | `/login` → `send-otp` → `signIn(login, otp)` | JWT |
| Forgot password | `/forgot-password` → verify → reset (see AUTH-001) | — |
| Setup password | `/setup-password?userId=` (see AUTH-003) | — |
| Admin | `/admin/login` → JWT in `localStorage` | Separate from NextAuth |

**Route protection:** `src/proxy.ts` guards `/portal/*` only; `/api/*` relies on per-handler `getServerSession`.

---

## Suggested fix order

1. AUTH-001, AUTH-002, AUTH-003 (critical APIs)  
2. AUTH-004, AUTH-005 (OTP hardening)  
3. AUTH-014, AUTH-015 (admin)  
4. AUTH-006, AUTH-007, AUTH-008  
5. AUTH-009, AUTH-013, AUTH-017 (UX + consolidation)  
6. AUTH-010, AUTH-011, AUTH-012, AUTH-016  

---

## Manual test checklist

- [ ] Onboarding T1: OTP verify → session; cannot `signIn(register)` without prior OTP (**should fail after AUTH-002**)
- [ ] Forgot password: cannot reset without OTP token (**should fail after AUTH-001**)
- [ ] Setup password: cannot set with arbitrary `userId` (**should fail after AUTH-003**)
- [ ] Login OTP: verify rate limit after N wrong codes (**after AUTH-004**)
- [ ] `returnUrl=/souscrire-ape` returns to subscription after login (**after AUTH-009**)
- [ ] Logout; optional idle timeout (**after AUTH-010**)
