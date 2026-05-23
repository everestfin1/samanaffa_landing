# Onboarding & profile completion — tracked issues

**Branch:** `feat/onboarding-flow-mock`  
**Recorded:** 2026-05-18 (initial), **2026-05-19** (reviews), **2026-05-19** (post-OTP-login orchestration review), **2026-05-21** (Didit desktop SDK + signup/comms review)  
**Source:** T0–T6 implementation; full flow + auth orchestration audit  
**Scope:** `src/app/onboarding/`, `src/components/onboarding/`, `src/app/api/onboarding/`, `src/app/api/kyc/`, `src/lib/kyc-sync.ts`, portal deposit/profile/notifications  
**Related:** [auth-issues.md](./auth-issues.md) — AUTH-002, AUTH-013, AUTH-020, login OTP

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

**ID note:** `ONB-024` is used twice in history (localhost callback = done; webhook binding = open). Do not renumber; refer by title.

---

## Summary (open items)

| Severity | Open | Sprint |
|----------|------|--------|
| critical | 0 | — (ONB-023/041 done 2026-05-20) |
| high     | 0 | — |
| medium   | 0 | — |
| low      | 0 | — |

_Done:_ ONB-001–ONB-022, ONB-024 (localhost callback), ONB-030–034, ONB-036–038 (bar + KYC redirect), ONB-035 (poll errors in verifying UI), ONB-044-notif (KYC notification deep links by status), ONB-044-portal (Didit new tab in portal modal), ONB-046, ONB-047, ONB-008 (core unit tests). **Didit desktop web SDK** (commits `35cab5c`, `1d8d5d3`, 2026-05-21).

---

## Critical (open)

### ONB-023 — Client can set `kycApproved` in onboarding progress PATCH
- **Status:** done
- **Area:** security
- **Files:** `src/app/api/onboarding/progress/route.ts`, `src/app/onboarding/page.tsx`
- **Problem:** PATCH accepts `body.kycApproved` from client; `onboarding/page.tsx` sends `kycApproved: true` when advancing to T6.
- **Impact:** UI can show KYC complete / reach T6 without `user.kycStatus === 'APPROVED'`.
- **Acceptance:** Ignore client `kycApproved`; derive from `user.kycStatus` on GET; reject PATCH `step: 'T6'` unless `kycStatus === 'APPROVED'`.
- **Sprint:** P0 — with AUTH-002.
- **Resolution (2026-05-20):** Server ignores client `kycApproved`; T6 requires `kycStatus === APPROVED`.

### ONB-041 — KYC upload IDOR (no session)
- **Status:** done
- **Area:** security
- **Files:** `src/app/api/kyc/upload/route.ts`
- **Problem:** `POST` and `GET` accept client `userId` with no `getServerSession`. Files uploaded to Vercel Blob with `access: 'public'`.
- **Impact:** Upload or list KYC documents for any user; public URLs for identity documents.
- **Acceptance:** Require session; `userId === session.user.id`; private blob access; rate limit per authenticated user.
- **Sprint:** P0 — same phase as AUTH-002 / ONB-023.
- **Resolution (2026-05-20):** Session required; `userId` from session only. Blob still `public` (SDK constraint); follow-up for signed URLs.

---

## High (open)

### ONB-024 — Didit webhook does not bind session to user
- **Status:** done
- **Area:** security
- **Files:** `src/app/api/webhooks/didit/route.ts`, `src/lib/kyc-sync.ts`
- **Problem:** Webhook trusts `vendor_data` user id without verifying `session_id` belongs to that user’s `kycDocument`.
- **Impact:** Wrong-user KYC sync if session id is known/guessed.
- **Acceptance:** Load `kycDocument` by `session_id`; require `userId === vendor_data` before `syncDiditDecision`.
- **Sprint:** P2.
- **Resolution (2026-05-20):** Webhook loads `kycDocument` by `session_id` (`fileUrl`); rejects if `userId !== vendor_data`.

_(Distinct from resolved **ONB-024 — Didit callback localhost on preview** — same ID, different issue.)_

### ONB-025 — Didit webhook secret optional
- **Status:** done
- **Area:** security / ops
- **Files:** `src/app/api/webhooks/didit/route.ts`
- **Problem:** Signature verification skipped when `DIDIT_WEBHOOK_SECRET` unset.
- **Acceptance:** Reject webhooks in production without secret; fail deploy check if missing.
- **Sprint:** P2.
- **Resolution (2026-05-20):** Production returns 503 if `DIDIT_WEBHOOK_SECRET` unset; signature required when set.

### ONB-008 — No automated tests for onboarding
- **Status:** done
- **Area:** quality
- **Files:** `vitest.config.ts`, `src/lib/*.test.ts`
- **Problem:** No unit/integration tests for onboarding APIs, KYC sync, profile completion rules.
- **Acceptance:** Tests for core pure functions; extend to hooks/API integration over time.
- **Resolution (2026-05-21):** Vitest + 12 tests: `kyc-session`, `onboarding-progress`, `auth-session`, `notification-action-url`, `user-notifications`.

### ONB-048 — T1 duplicate phone: generic OTP response without session or login CTA
- **Status:** done
- **Area:** ux / auth
- **Files:** `src/app/api/onboarding/create-account/route.ts`, `src/components/onboarding/T1Phone.tsx`, `src/lib/otp-send-response.ts`
- **Problem:** `send-otp` returns `genericOtpSendResponse()` (success, no `sessionId`) when phone already registered (anti-enumeration). T1 only advances when `sessionId` is set and does not show the generic message on success.
- **Impact:** User with existing number sees no OTP step and no clear “already registered” guidance — looks broken.
- **Acceptance:** On duplicate phone, return same generic copy **and** show it in UI with link to `/login`; do not advance to OTP UI without `sessionId`; optional: still avoid revealing whether account exists in API body beyond generic text.
- **Sprint:** P1 — signup polish.
- **Source:** Code review 2026-05-21 (AUTH-007 tradeoff).
- **Resolution (2026-05-21):** T1 shows generic message + login link when `send-otp` returns success without `sessionId`; blur check via `check-availability`.

### ONB-049 — `verify-otp` duplicate phone check uses single format
- **Status:** done
- **Area:** reliability / data
- **Files:** `src/app/api/onboarding/create-account/route.ts`, `src/lib/utils.ts` (`generatePhoneFormats`)
- **Problem:** `send-otp` checks `generatePhoneFormats()`; `verify-otp` only `findFirst({ where: { phone } })` with session’s normalized value.
- **Impact:** Legacy rows (`772…` vs `+221772…`) may bypass duplicate detection or hit DB unique constraint as 500.
- **Acceptance:** Reuse `generatePhoneFormats(phone)` on verify; align with `sendOTP` registration-session checks.
- **Sprint:** P1 — with ONB-048.
- **Resolution (2026-05-21):** `verify-otp` uses `generatePhoneFormats()`; `P2002`/unique → 409 (ONB-052).

---

## Medium (open)

### ONB-053 — Portal / onboarding do not reflect `UNDER_REVIEW` after login
- **Status:** done
- **Area:** ux / KYC
- **Files:** `useDiditKycVerification.ts`, `T5KYC.tsx`, `KYCInitiationModal.tsx`, `kyc-session.ts`
- **Problem:** Didit `in_review` UI was session-local; logged-in users at T5 or portal saw "Commencer" again; polling stopped at `in_review`.
- **Resolution (2026-05-21):** Hydrate from `user.kycStatus`; poll through `in_review` until terminal; portal KYC modal wired on dashboard.

### ONB-050 — `/api/auth/check-availability` unused; no live email/phone validation in UI
- **Status:** done
- **Area:** ux
- **Files:** `src/app/api/auth/check-availability/route.ts`, `T1Phone.tsx`, `ProfileCompletionModal.tsx`
- **Problem:** Availability API exists but no client calls it. T1 has no pre-submit duplicate hint; comms modal only surfaces email conflict after `PATCH /api/portal/profile/complete` (409).
- **Impact:** QA perceives “no proper check” for phone at signup and email on dashboard.
- **Acceptance:** Debounced availability check on T1 phone blur (generic messaging) and comms modal email blur; or remove dead API if product stays submit-only.
- **Sprint:** P2.
- **Note:** Server-side email uniqueness on comms modal **works** (`profile/complete`); this is proactive UX.
- **Resolution (2026-05-21):** Debounced blur on T1 phone (generic hint) and profile comms email.

### ONB-051 — KYC rejection SMS during active onboarding
- **Status:** done
- **Area:** ux / notifications
- **Files:** `src/lib/kyc-sync.ts`, `src/lib/notification-settings.ts`, `src/lib/notifications.ts`
- **Problem:** Poll on T5 → `syncDiditDecision` → `sendKYCStatusSMS` for `REJECTED` when `enableKYCRejectionSMS` is true (default).
- **Impact:** User still on onboarding T5 receives “consultez votre portail” SMS after a failed Didit attempt.
- **Acceptance:** Skip or defer rejection SMS while `investorProfile.onboarding` incomplete / user not yet on portal; still create in-app notification.
- **Sprint:** P2.
- **Resolution (2026-05-21):** Skip rejection SMS when `isOnboardingInProgress(investorProfile)`.

### ONB-052 — `user.create` unique violation should return 409
- **Status:** done
- **Area:** reliability
- **Files:** `src/app/api/onboarding/create-account/route.ts`
- **Problem:** Concurrent `verify-otp` requests can race past `findFirst`; Prisma `P2002` on `users_phone_key` may surface as 500.
- **Acceptance:** Catch `P2002` on phone/email; return `409` with “Compte déjà existant”.
- **Sprint:** P3.
- **Resolution (2026-05-21):** `isUniqueConstraintError()` catch on `user.create`.

---

## Medium (resolved — continued)

### ONB-026 — T4 wallet choice vs Intouch-only confirmation
- **Status:** done
- **Area:** ux / payments
- **Files:** `T4Deposit.tsx`, `deposit-intent/route.ts`, `OnboardingDepositModal.tsx`, `TransferModal.tsx`
- **Problem:** T4 stores Orange/Wave/Free Money; post-KYC confirm always uses Intouch.
- **Acceptance:** Align copy (“paiement via Intouch”) or implement selected rail at confirm.
- **Resolution (2026-05-20):** T4/API lock `paymentMethod` to `intouch`; schedule-intent UI shows Intouch only; confirm modal always labels Intouch.

### ONB-027 — Onboarding deposit intent discovered via `userNotes` substring
- **Status:** done
- **Area:** data
- **Files:** `src/app/api/onboarding/pending-deposit/route.ts`, `deposit-intent/route.ts`
- **Problem:** `userNotes: { contains: 'onboarding' }` is fragile if copy changes.
- **Acceptance:** Structured metadata (e.g. `source: 'ONBOARDING_V2'`) on intent; filter/index on that.
- **Sprint:** P3 — recommended before scaling onboarding volume.
- **Resolution (2026-05-20):** `ONBOARDING_V2|` prefix + `findOnboardingDepositIntent()` helper.

### ONB-028 — No idempotency for deposit intent / Didit session creation
- **Status:** done
- **Area:** reliability
- **Files:** `deposit-intent/route.ts`, `kyc/start/route.ts`
- **Problem:** Repeat T4/T5 creates multiple pending intents or Didit sessions.
- **Acceptance:** One active onboarding intent per user; reuse open Didit session when possible.
- **Resolution (2026-05-20):** Reuse pending onboarding deposit intent; reuse open Didit session when still active.

### ONB-042 — Onboarding progress save fails silently
- **Status:** done
- **Area:** reliability
- **Files:** `src/app/onboarding/page.tsx` (`saveProgress`)
- **Problem:** `fetch('/api/onboarding/progress')` errors are caught and ignored (`// non-fatal`). User can advance steps while server state is stale.
- **Impact:** Resume after refresh shows wrong step; KYC/deposit state desync.
- **Acceptance:** Surface error to user; block step advance on non-OK PATCH (or retry with backoff).
- **Sprint:** P2.
- **Resolution (2026-05-20):** `saveProgress` returns success flag; step advance blocked on failure; error banner shown.

### ONB-031 — Notifications full page ignores `metadata.actionUrl`
- **Status:** done
- **Area:** ux
- **Files:** `src/app/portal/notifications/page.tsx`, `NotificationDropdown.tsx`
- **Acceptance:** Shared `getActionUrl(notification)` used by both surfaces.
- **Resolution (2026-05-20):** `src/lib/notification-action-url.ts` shared by dropdown and full page.

### ONB-032 — User notifications fail silently
- **Status:** done
- **Area:** reliability
- **Files:** `src/lib/user-notifications.ts`
- **Acceptance:** Return boolean or throw; optional retry; monitor failures in prod.
- **Resolution (2026-05-20):** `createUserNotification` returns `boolean`.

### ONB-033 — Profile communications modal only on dashboard
- **Status:** done
- **Area:** ux
- **Files:** `portal/dashboard/page.tsx`, `ProfileCompletionModal.tsx`, `portal-profile-completion.ts`
- **Acceptance:** Consistent gate before first deposit confirm.
- **Resolution (2026-05-20):** `SamaNaffaPortal` shows modal when `confirmDeposit=1` and profile incomplete.

### ONB-034 — Profile page allows editing fields filled by Didit
- **Status:** done
- **Area:** ux / compliance
- **Files:** `portal/profile/page.tsx`, `portal-profile-completion.ts`
- **Acceptance:** Lock identity fields or separate verified vs contact sections.
- **Resolution (2026-05-20):** Verified identity banner; hide name fields; save omits locked fields.

### ONB-036 — T3 `apply-formula` response not checked
- **Status:** done
- **Area:** bug
- **Files:** `T3Quiz.tsx`
- **Acceptance:** Block advance on non-OK response; show error.
- **Resolution (2026-05-20):** Non-OK blocks advance; result screen only after both PATCH + apply-formula succeed (no optimistic formula UI).

### ONB-037 — Didit `verificationUrl` lost after redirect (T5 resume)
- **Status:** done
- **Area:** ux
- **Files:** `T5KYC.tsx`, `kyc-navigation.ts`, `onboarding/page.tsx`
- **Acceptance:** Persist URL in `sessionStorage` with session id.
- **Resolution (2026-05-20):** `kyc-navigation.ts` sessionStorage helpers; T5 restores URL on resume.

---

## Low (open)

### ONB-029 — Duplicate KYC UI (T5 vs portal modal)
- **Status:** done
- **Area:** maintenance
- **Files:** `T5KYC.tsx`, `KYCInitiationModal.tsx`, `useDiditKycVerification.ts`, `DiditKycStagePanels.tsx`
- **Resolution (2026-05-20):** Shared hook + stage panels; T5 and portal modal are thin wrappers.

### ONB-030 — T6 copy still references pending identity validation
- **Status:** done
- **Area:** ux / copy
- **Files:** `T6Dashboard.tsx`
- **Resolution (2026-05-20):** Post-KYC deposit copy; Intouch from dashboard.

### ONB-035 — T5 KYC poll errors hidden
- **Status:** done
- **Area:** ux
- **Files:** `T5KYC.tsx`, `DiditKycStagePanels.tsx`
- **Resolution (2026-05-20):** Poll failures shown inline on verifying stage (shared panels).

### ONB-044 — KYC notification deep links ignore status (REJECTED → deposit)
- **Status:** done
- **Area:** ux
- **Files:** `src/lib/notification-action-url.ts`
- **Resolution (2026-05-20):** `kyc_status` routes by `metadata.kycStatus`; safe internal `actionUrl` only.

### ONB-045 — `kyc-deposit-intents` scope to `ONBOARDING_V2|` notes only
- **Status:** done
- **Resolution (2026-05-21):** Cancel/release filters include `ONBOARDING_V2|%` userNotes prefix.

### ONB-043 — Profile comms modal: gate all Sama Naffa deposit confirms
- **Status:** done
- **Area:** ux
- **Files:** `SamaNaffaPortal.tsx`, `PendingOnboardingDepositCard.tsx`
- **Problem:** Modal auto-opens only with `?confirmDeposit=1`; card “Confirmer” skips communications gate.
- **Acceptance:** Same as dashboard — block or modal before first Intouch confirm.
- **Resolution (2026-05-21):** `onBeforeConfirm` opens profile modal when comms incomplete.

### ONB-038 — Progress bar: T5 and T6 share same visible index
- **Status:** done
- **Area:** ux
- **Files:** `onboarding/page.tsx`
- **Note:** Different from resolved ONB-038 (KYC → login redirect).
- **Resolution (2026-05-20):** `VISIBLE_STEPS = 6`; T6 at index 6.

### ONB-039 — Manual test checklist / docs out of date
- **Status:** done
- **Area:** docs
- **Files:** This file, `onboarding-replace-register-plan.md`, [auth-issues.md](./auth-issues.md)
- **Acceptance:** Checklists reflect OTP-only login, manual Intouch deposit, security sprint items.
- **Resolution (2026-05-20):** Checklists and plan doc updated for Phases 1–4 outcomes.

### ONB-040 — `kyc-sync` intent updates duplicated in admin route
- **Status:** done
- **Area:** maintenance
- **Files:** `kyc-sync.ts`, `kyc-deposit-intents.ts`, `src/app/api/admin/kyc/[id]/route.ts`
- **Resolution (2026-05-20):** `updateOnboardingDepositIntentsForKycStatus()` shared by Didit sync and admin KYC PUT.

### ONB-044-portal — Portal KYC modal: resume Didit in new tab
- **Status:** done
- **Area:** ux
- **Files:** `useDiditKycVerification.ts`, `kyc-navigation.ts`, `KYCInitiationModal.tsx`
- **Resolution (2026-05-23):** `openDiditInNewTab` for portal; same-tab redirect kept for onboarding T5.

### ONB-046 — Legacy intents: `paymentMethod` ≠ Intouch label in confirm modal
- **Status:** done
- **Area:** ux / data
- **Files:** `payment-method-label.ts`, `onboarding-deposit.ts`, `pending-deposit/route.ts`, `OnboardingDepositModal.tsx`
- **Resolution (2026-05-23):** Display labels via helper; lazy DB backfill `orange_money` / `wave` / `free_money` → `intouch` on pending-deposit GET.

### ONB-047 — T6 “Prêt” vs webhook / sync race
- **Status:** done
- **Area:** ux
- **Files:** `release-deposit/route.ts`, `onboarding-deposit-release.ts`, `onboarding/page.tsx`, `T6Dashboard.tsx`
- **Resolution (2026-05-23):** `POST /api/onboarding/release-deposit` before T6; T6 shows “En préparation” if release not confirmed within poll window.

---

## Resolved (reference)

| ID | Title | Resolution |
|----|--------|------------|
| ONB-001 | Deposit after KYC | Manual Intouch confirm by design |
| ONB-002 | Profile PATCH IDOR | Session required |
| ONB-003 | KYC status poll IDOR | Session + kycDocument ownership |
| ONB-004–007 | KYC gate, resume, simulation, formula | Done 2026-05-19 |
| ONB-009–022 | UX/copy/quality batch | Done except tests (ONB-008) |
| ONB-024 | Didit localhost callback | `getAppBaseUrl` |
| ONB-038 | KYC → login redirect | `callbackUrl` + session gating |

---

## Orchestration — onboarding vs auth

| Step | Client | API | Auth |
|------|--------|-----|------|
| T0 | Simulator | — | None |
| T1 | Phone + OTP | `create-account` | Public; then `signIn(register)` ⚠️ AUTH-002 |
| T2–T4 | Name, quiz, deposit | `profile`, `progress`, `apply-formula`, `deposit-intent` | Session |
| T5 | Didit KYC | `kyc/start`, `kyc/status` | Session; status checks `kycDocument` |
| T6 | Celebration → portal | `progress` PATCH | Session; **must** enforce real KYC (ONB-023) |

**Public endpoints (by design):** `POST /api/onboarding/create-account` only. All other onboarding routes should require session.

---

## Suggested fix order

Align with [auth-issues.md](./auth-issues.md) **Phase 1–4**.

### Phase 1 (P0) — with auth sprint
1. ONB-023, ONB-041  
2. AUTH-002 (onboarding session — auth tracker)

### Phase 2 (P2) — KYC trust
3. ONB-024 (webhook binding), ONB-025  
4. ONB-042 (progress save reliability)

### Phase 3 (P2–P3) — data & portal
5. ONB-027, ONB-028  
6. ONB-031, ONB-032, ONB-033, ONB-034  

### Phase 4 (P3) — polish & quality
7. ONB-026, ONB-029, ONB-030, ONB-035, ONB-036, ONB-037, ONB-038 (progress bar)  
8. ONB-008, ONB-040, ONB-039 (docs)

### Phase 5 (P1–P2) — signup & comms (2026-05-21 review)
1. **ONB-048**, **ONB-049** — T1 duplicate phone UX + verify format parity  
2. **ONB-050** — availability API wired or removed; email/phone blur validation  
3. **ONB-051** — defer KYC rejection SMS during onboarding  
4. **ONB-052** — Prisma unique → 409 on `create-account`  
5. **AUTH-026** — Didit `capture_method` bootstrap (auth tracker)

---

## Manual test checklist

- [ ] T1 existing phone: generic message + login CTA; no OTP step without `sessionId` (**ONB-048**)
- [ ] T1 verify: duplicate detected across phone format variants (**ONB-049**)
- [ ] T0 → T1: simulation persisted; OTP; session after T1 via post-signup token (**AUTH-002**)
- [ ] Cannot `signIn(register)` without valid post-`create-account` token (**AUTH-002**)
- [ ] T4: amount only; `paymentMethod=intouch`; intent `awaitingKycApproval: true`; no auto-charge (**ONB-026**)
- [ ] T5: Didit flow (shared hook); DB `kycStatus` → APPROVED; resume URL in sessionStorage (**ONB-037**)
- [ ] Cannot PATCH `kycApproved: true` without real KYC (**ONB-023**)
- [ ] Cannot upload/list KYC for another `userId` (**ONB-041**)
- [ ] After KYC approve: intent released (`awaitingKycApproval=false`); pay via Intouch on Sama Naffa (`confirmDeposit=1`)
- [ ] Profile communications modal on dashboard + Sama Naffa when incomplete (**ONB-033**)
- [ ] Comms modal: duplicate email shows clear error (409); optional blur check (**ONB-050**)
- [ ] T5 Didit decline: no rejection SMS while still in onboarding (**ONB-051**)
- [ ] Desktop T5: Didit SDK modal; mobile redirect; Réessayer creates fresh session (2026-05-21)
- [ ] KYC return without session → `/login?callbackUrl=…` → resume onboarding (**AUTH-009**, **ONB-038**)
- [ ] T1 auto-login failure → `/login?callbackUrl=/onboarding` (**AUTH-017**)
- [ ] Logout → `/login` phone OTP → portal; idle timeout in portal (**AUTH-010**, **AUTH-018**)
- [ ] Refresh mid-onboarding: resume matches server; progress PATCH errors block advance (**ONB-042**)
- [ ] Portal profile: verified identity locks name fields (**ONB-034**)
- [x] Notifications page: same deep links as dropdown (**ONB-031**)
