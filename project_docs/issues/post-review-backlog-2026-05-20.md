# Post-review backlog (2026-05-20+)

Deferred after code review of Phases 1–4 + ONB-026/029/039/040.  
**Fixed same day:** H4 (T3 quiz), H5 (KYC poll UI), H1 (JWT sessionVersion throttle), M4 (notification deep links).

**2026-05-21 review** (Didit desktop SDK + signup/comms): tracked as **ONB-048–052** and **AUTH-026** in main issue files — see [onboarding-issues.md](./onboarding-issues.md) and [auth-issues.md](./auth-issues.md).

Use this file when picking up polish before or alongside new product work (deprecate Emprunt obligataire, KYC capture-only).

---

## Auth (`auth-issues.md`)

| ID | Severity | Title | Files / notes |
|----|----------|-------|----------------|
| AUTH-023 | medium | `sessionVersion` in `investorProfile` JSON (race) | Move to dedicated DB column; `auth-session.ts`, Prisma migration |
| AUTH-024 | low | Portal idle banner: French + English time mix | `useSessionTimeout.ts` `formatTimeRemaining` |
| AUTH-025 | low | `metadata.actionUrl` allowlist at write time | `user-notifications.ts`, `kyc-sync.ts` (read path hardened in M4 fix) |

---

## Onboarding / portal (`onboarding-issues.md`)

| ID | Severity | Title | Files / notes |
|----|----------|-------|----------------|
| ONB-043 | medium | Profile comms modal: gate all deposit confirms on Sama Naffa | `SamaNaffaPortal.tsx`, `PendingOnboardingDepositCard.tsx` — today only `?confirmDeposit=1` |
| ONB-044 | low | Portal KYC modal: resume Didit in new tab (optional) | `useDiditKycVerification.ts` — `openInNewTab` for portal callers |
| ONB-045 | low | `kyc-deposit-intents` scope to `ONBOARDING_V2\|` notes only | `kyc-deposit-intents.ts` — match `findOnboardingDepositIntent` filter |
| ONB-046 | low | Legacy intents: `paymentMethod` ≠ intouch label in confirm modal | Data backfill or one-time notice |
| ONB-047 | low | T6 “Prêt” vs webhook race | Edge case; optional poll before T6 |
| ONB-008 | high | Automated tests (unchanged) | Vitest for `notification-action-url`, `kyc-deposit-intents`, KYC hook |

### 2026-05-21 review → main trackers

| ID | Severity | Title | Tracker |
|----|----------|-------|---------|
| ONB-048 | high | T1 duplicate phone: generic OTP, no sessionId / login CTA | [onboarding-issues.md](./onboarding-issues.md#onb-048--t1-duplicate-phone-generic-otp-response-without-session-or-login-cta) |
| ONB-049 | high | `verify-otp` phone duplicate: single format only | [onboarding-issues.md](./onboarding-issues.md#onb-049--verify-otp-duplicate-phone-check-uses-single-format) |
| ONB-050 | medium | `check-availability` unused; no blur validation | [onboarding-issues.md](./onboarding-issues.md#onb-050--apiauthcheck-availability-unused-no-live-emailphone-validation-in-ui) |
| ONB-051 | medium | KYC rejection SMS during onboarding | [onboarding-issues.md](./onboarding-issues.md#onb-051--kyc-rejection-sms-during-active-onboarding) |
| ONB-052 | low | Prisma unique → 409 on create-account | [onboarding-issues.md](./onboarding-issues.md#onb-052--usercreate-unique-violation-should-return-409) |
| AUTH-026 | medium | Didit `capture_method` PATCH from KYC start | [auth-issues.md](./auth-issues.md#auth-026--didit-capture_method-patched-from-public-kyc-start) |

---

## Product / features (not in trackers yet)

- **Didit web browser verification** — **done (2026-05-21):** `@didit-protocol/sdk-web` modal on desktop (≥1024px, fine pointer); mobile keeps redirect. `callback_method: both`, `GET /api/onboarding/kyc/session-url`, CSP `frame-src` + camera/mic for `verify.didit.me`. If QR still shows, set Didit `capture_method` to `both` via `scripts/ensure-didit-capture-method.ts` or Didit Console → API & Webhooks (`DIDIT_CAPTURE_METHOD=both`).
- **Deprecate Emprunt obligataire** — remove routes, copy, and DB references per product decision.
- **KYC capture-only (no file upload)** — force live scan/selfie in Didit flow (workflow/console + verify upload paths in `Step4Documents` / legacy KYC if any). Didit: confirm workflow disables gallery upload; app: remove or hide file-picker fallbacks where KYC still allows upload.

---

## Reference

- Review validated 2026-05-20 in agent session; overstated items (M6 profile 400, M5 `active` flag) intentionally omitted here.
