# Post-review backlog (2026-05-20)

Deferred after code review of Phases 1–4 + ONB-026/029/039/040.  
**Fixed same day:** H4 (T3 quiz), H5 (KYC poll UI), H1 (JWT sessionVersion throttle), M4 (notification deep links).

Use this file when picking up polish before or alongside new product work (Didit web verification, deprecate Emprunt obligataire).

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

---

## Product / features (not in trackers yet)

- **Didit web browser verification** — **done (2026-05-21):** `@didit-protocol/sdk-web` modal on desktop (≥1024px, fine pointer); mobile keeps redirect. `callback_method: both`, `GET /api/onboarding/kyc/session-url`, CSP `frame-src` + camera/mic for `verify.didit.me`. If QR still shows, set Didit `capture_method` to `both` via `scripts/ensure-didit-capture-method.ts` or Didit Console → API & Webhooks (`DIDIT_CAPTURE_METHOD=both`).
- **Deprecate Emprunt obligataire** — remove routes, copy, and DB references per product decision.
- **KYC capture-only (no file upload)** — force live scan/selfie in Didit flow (workflow/console + verify upload paths in `Step4Documents` / legacy KYC if any). Didit: confirm workflow disables gallery upload; app: remove or hide file-picker fallbacks where KYC still allows upload.

---

## Reference

- Review validated 2026-05-20 in agent session; overstated items (M6 profile 400, M5 `active` flag) intentionally omitted here.
