# Onboarding & profile completion — tracked issues

**Branch:** `feat/onboarding-flow-mock`  
**Recorded:** 2026-05-18 (initial), **2026-05-19** (post-review additions)  
**Source:** Code review after T0–T6 onboarding + portal profile completion; full flow audit 2026-05-19  
**Scope:** `src/app/onboarding/`, `src/components/onboarding/`, `src/app/api/onboarding/`, `src/lib/kyc-sync.ts`, `src/lib/didit-decision.ts`, `src/lib/kyc-navigation.ts`, portal deposit/profile/notifications  
**Related:** [auth-issues.md](./auth-issues.md) for login and session security

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

---

## Summary

| Severity | Open (2026-05-19) |
|----------|-------------------|
| critical | 1 |
| high     | 2 |
| medium   | 9 |
| low      | 5 |

_ONB-001–ONB-022 (original batch): done except ONB-008. New items ONB-023+ from 2026-05-19 review._

---

## Critical

### ONB-001 — Deposit never executes after KYC approval
- **Status:** done
- **Area:** payments / kyc-sync
- **Files:** `src/lib/kyc-sync.ts`, `src/app/api/onboarding/deposit-intent/route.ts`, `PendingOnboardingDepositCard.tsx`, `OnboardingDepositModal.tsx`
- **Problem:** (Original) `deposit-intent` implied auto-charge on KYC approval; `syncDiditDecision` only cleared `awaitingKycApproval`.
- **Resolution (2026-05-19):** **By design** — user confirms first deposit on Sama Naffa via Intouch after KYC. Intent released on approve; portal card + notifications guide confirm flow. Ensure copy/QA match (see ONB-039).

### ONB-002 — Unauthenticated PATCH `/api/onboarding/profile`
- **Status:** done
- **Area:** security
- **Files:** `src/app/api/onboarding/profile/route.ts`, `T2FirstName.tsx`, `T3Quiz.tsx`
- **Problem:** Endpoint trusts client-supplied `userId` with no session check (comment: “mock flow”).
- **Impact:** IDOR — anyone with a UUID can update another user’s name / `investorProfile`.
- **Acceptance:** Require session; `userId` must match `session.user.id` (or drop endpoint in favor of `/api/users/profile`).

### ONB-003 — KYC status poll accepts arbitrary `userId`
- **Status:** done
- **Area:** security
- **Files:** `src/app/api/onboarding/kyc/status/route.ts`, `T5KYC.tsx`
- **Problem:** `GET …/kyc/status?sessionId=&userId=` has no auth; `userId` is passed to `syncDiditDecision`.
- **Impact:** With a leaked Didit `sessionId`, KYC outcome could be synced to the wrong user.
- **Acceptance:** Authenticated request; `userId` derived from session and matched to session owner / `vendor_data`.

---

## High

### ONB-004 — Onboarding completable without full KYC approval
- **Status:** done
- **Area:** ux / kyc
- **Files:** `T5KYC.tsx`, `T6Dashboard.tsx`, `onboarding/page.tsx`
- **Problem:** `in_review` shares the same “Terminer” path as `approved`.
- **Impact:** Users reach T6 / portal while KYC may still be pending; T6 copy says “Identité vérifiée”.
- **Acceptance:** Gate T6 on `approved` only, or distinct copy/flows for `in_review`.

### ONB-005 — No resume after refresh or tab close
- **Status:** done
- **Area:** ux / state
- **Files:** `src/app/onboarding/page.tsx`
- **Problem:** Step state (`userId`, `formula`, `depositAmount`, etc.) is client-only.
- **Impact:** Refresh mid-flow loses progress despite valid session in DB.
- **Acceptance:** Persist step (and key fields) server-side; restore on return for logged-in users.

### ONB-006 — T0 simulation data not persisted on user
- **Status:** done
- **Area:** data
- **Files:** `T0Simulator.tsx`, `T1Phone.tsx`, `create-account/route.ts`
- **Problem:** Simulation stored in `registration_session` only; not copied to user on `verify-otp`.
- **Impact:** T0 engagement / personalization data lost.
- **Acceptance:** Save simulation on user or account metadata at account creation.

### ONB-007 — Quiz formula not applied to Sama Naffa account
- **Status:** done
- **Area:** product
- **Files:** `T3Quiz.tsx`, `create-account/route.ts`, `naffa-products`
- **Problem:** Account created with default product; T3 only saves `investorProfile` JSON.
- **Impact:** Recommended formula in UI does not match account `productCode` / rates.
- **Acceptance:** Map quiz result to product and update account (or create with correct product).

### ONB-008 — No automated tests for onboarding
- **Status:** open
- **Area:** quality
- **Files:** (none yet)
- **Problem:** No unit/integration tests for onboarding APIs, KYC sync, profile completion rules.
- **Acceptance:** Tests for `meetsPortalProfileRequirements`, OTP create-account, `syncDiditDecision`, deposit intent lifecycle.

---

## Medium

### ONB-009 — Progress bar stuck on step 1 for T1 and T2
- **Status:** done
- **Area:** ux
- **Files:** `src/app/onboarding/page.tsx`
- **Problem:** `visibleStepIndex` maps both T1 and T2 to `1` (“Étape 1 sur 4”).
- **Acceptance:** Five visible steps or merge T1+T2 in UX so progress advances per screen.

### ONB-010 — T2 shows “Données de démonstration” footer
- **Status:** done
- **Area:** ux / copy
- **Files:** `T2FirstName.tsx`
- **Problem:** Demo disclaimer on production registration screen.
- **Acceptance:** Remove or replace with real legal/helper copy.

### ONB-011 — Inconsistent tu/vous tone
- **Status:** done
- **Area:** ux / copy
- **Files:** `T2FirstName.tsx` vs T3–T5
- **Problem:** T2 formal “vous”; later steps informal “tu”.
- **Acceptance:** Single voice across onboarding (per product decision).

### ONB-012 — Mandatory profile modal UX (long form, no progress)
- **Status:** done
- **Area:** ux
- **Files:** `ProfileCompletionModal.tsx`, `portal/dashboard/page.tsx`
- **Problem:** Non-dismissible modal with many fields; no completion progress or escape to profile page.
- **Acceptance:** Progress indicator and/or link to `/portal/profile`; mobile-friendly layout review.

### ONB-013 — Referral “2 000 FCFA” on T6 not implemented
- **Status:** done
- **Area:** product
- **Files:** `T6Dashboard.tsx`
- **Problem:** WhatsApp share only; no referral tracking or payout.
- **Acceptance:** Implement referral program or remove/reword reward promise.

### ONB-014 — Didit `window.open` fragile (popup blockers)
- **Status:** done
- **Area:** ux
- **Files:** `T5KYC.tsx`
- **Problem:** New tab may be blocked; limited user feedback.
- **Acceptance:** Detect blocked popup; offer same-tab redirect or clear recovery steps.

### ONB-015 — KYC callback `window.close()` unreliable
- **Status:** done
- **Area:** ux
- **Files:** `src/app/onboarding/kyc-callback/page.tsx`
- **Problem:** Auto-close only works for script-opened windows.
- **Acceptance:** Clear manual instructions; optional deep link back to onboarding with session.

### ONB-016 — Profile modal form sync edge cases
- **Status:** done
- **Area:** bug
- **Files:** `ProfileCompletionModal.tsx`
- **Problem:** `useEffect` depends on `isOpen` + `initialData` but `buildFormData` not stable in deps.
- **Acceptance:** Stable initializer or explicit deps; verify reopen after partial save.

### ONB-017 — Portal dashboard does not gate on KYC status
- **Status:** done
- **Area:** ux
- **Files:** `src/app/portal/dashboard/page.tsx`
- **Problem:** Full dashboard shown regardless of `kycStatus` / pending deposit.
- **Acceptance:** Banner or gated actions until KYC approved and profile complete.

---

## Low

### ONB-018 — `T6Dashboard` uses `@ts-ignore` for Confetti
- **Status:** done
- **Area:** code quality
- **Files:** `T6Dashboard.tsx`

### ONB-019 — T5 title uses `h2` while other steps use `p`
- **Status:** done
- **Area:** ux / consistency
- **Files:** `T5KYC.tsx`

### ONB-020 — `T4Deposit` unused `userId` prop
- **Status:** done
- **Area:** code quality
- **Files:** `T4Deposit.tsx`, `onboarding/page.tsx`

### ONB-021 — `onboarding-replace-register-plan.md` outdated
- **Status:** done
- **Area:** docs
- **Files:** `project_docs/onboarding-replace-register-plan.md`
- **Problem:** Still describes moving T2–T6 to portal after T1; implementation keeps full in-flow onboarding.
- **Acceptance:** Update “Current status” and critical tasks to match code.

### ONB-022 — `MOCK_OTP` must not ship to production
- **Status:** done
- **Area:** ops / security
- **Files:** `src/lib/notifications.ts`, `create-account/route.ts`, `T1Phone.tsx`
- **Problem:** Dev mock OTP in API/UI if env misconfigured.
- **Acceptance:** Enforce env checks in prod builds; hide dev UI when disabled.

---

## Critical (2026-05-19 review)

### ONB-024 — Didit KYC callback used localhost on preview
- **Status:** done
- **Area:** ops / kyc
- **Files:** `src/app/api/onboarding/kyc/start/route.ts`, `src/lib/app-url.ts`
- **Problem:** `NEXT_PUBLIC_APP_URL` unset on Vercel → Didit `callback` defaulted to `http://localhost:3000/onboarding/kyc-callback`.
- **Acceptance:** Resolve base URL from env, request host (`dev.samanaffa.com`), or `VERCEL_URL`; set `NEXT_PUBLIC_APP_URL` on Preview for explicit override.

### ONB-023 — Client can set `kycApproved` in onboarding progress PATCH
- **Status:** open
- **Area:** security
- **Files:** `src/app/api/onboarding/progress/route.ts`, `src/app/onboarding/page.tsx`
- **Problem:** PATCH accepts `body.kycApproved` from client and persists in `investorProfile.onboarding`.
- **Impact:** UI state can show KYC complete / advance toward T6 without real `user.kycStatus`.
- **Acceptance:** Ignore client `kycApproved`; derive from `user.kycStatus`; block step `T6` unless `APPROVED`.

---

## High (2026-05-19 review)

### ONB-024 — Didit webhook does not bind session to user
- **Status:** open
- **Area:** security
- **Files:** `src/app/api/webhooks/didit/route.ts`, `src/lib/kyc-sync.ts`
- **Problem:** Webhook trusts `vendor_data` user id without verifying `session_id` belongs to that user’s `kycDocument`.
- **Impact:** Wrong-user KYC sync if session id is known/guessed.
- **Acceptance:** Load `kycDocument` by `session_id`; require `userId === vendor_data` before `syncDiditDecision`.

### ONB-025 — Didit webhook secret optional
- **Status:** open
- **Area:** security / ops
- **Files:** `src/app/api/webhooks/didit/route.ts`
- **Problem:** Signature verification skipped when `DIDIT_WEBHOOK_SECRET` unset.
- **Acceptance:** Reject webhooks in production without secret; fail deploy check if missing.

---

## Medium (2026-05-19 review)

### ONB-026 — T4 wallet choice vs Intouch-only confirmation
- **Status:** open
- **Area:** ux / payments
- **Files:** `T4Deposit.tsx`, `deposit-intent/route.ts`, `OnboardingDepositModal.tsx`
- **Problem:** T4 stores Orange/Wave/Free Money; post-KYC confirm always uses Intouch.
- **Acceptance:** Align copy (“paiement via Intouch”) or implement selected rail at confirm.

### ONB-027 — Onboarding deposit intent discovered via `userNotes` substring
- **Status:** open
- **Area:** data
- **Files:** `src/app/api/onboarding/pending-deposit/route.ts`, `deposit-intent/route.ts`
- **Problem:** `userNotes: { contains: 'onboarding' }` is fragile if copy changes.
- **Acceptance:** Structured metadata (e.g. `source: 'ONBOARDING_V2'`) on intent; filter/index on that.

### ONB-028 — No idempotency for deposit intent / Didit session creation
- **Status:** open
- **Area:** reliability
- **Files:** `deposit-intent/route.ts`, `kyc/start/route.ts`
- **Problem:** Repeat T4/T5 creates multiple pending intents or Didit sessions.
- **Acceptance:** One active onboarding intent per user; reuse open Didit session when possible.

### ONB-031 — Notifications full page ignores `metadata.actionUrl`
- **Status:** open
- **Area:** ux
- **Files:** `src/app/portal/notifications/page.tsx`, `src/components/notifications/NotificationDropdown.tsx`
- **Problem:** Dropdown uses `metadata.actionUrl` and `kind`; notifications page only maps legacy `KYC_STATUS` / `TRANSACTION` types.
- **Acceptance:** Shared `getActionUrl(notification)` used by both surfaces.

### ONB-032 — User notifications fail silently
- **Status:** open
- **Area:** reliability
- **Files:** `src/lib/user-notifications.ts`
- **Problem:** `createUserNotification` catches and logs errors; callers assume success.
- **Acceptance:** Return boolean or throw; optional retry; monitor failures in prod.

### ONB-033 — Profile communications modal only on dashboard
- **Status:** open
- **Area:** ux
- **Files:** `src/app/portal/dashboard/page.tsx`, `ProfileCompletionModal.tsx`, `src/lib/portal-profile-completion.ts`
- **Problem:** Comms requirements (email + consents) gated only on dashboard; Sama Naffa deposit confirm not gated.
- **Acceptance:** Consistent gate before first deposit confirm; link from profile for tmp email users.

### ONB-034 — Profile page allows editing fields filled by Didit
- **Status:** open
- **Area:** ux / compliance
- **Files:** `src/app/portal/profile/page.tsx`, `portal-profile-completion.ts`
- **Problem:** Identity from KYC is “verified via Didit” for DOB but name/address remain editable in profile edit mode.
- **Acceptance:** Product policy: lock identity fields or clearly separate “verified” vs “contact” sections.

### ONB-036 — T3 `apply-formula` response not checked
- **Status:** open
- **Area:** bug
- **Files:** `T3Quiz.tsx`
- **Problem:** Fetch to apply formula may fail; user can still advance.
- **Acceptance:** Block advance on non-OK response; show error.

### ONB-037 — Didit `verificationUrl` lost after redirect (T5 resume)
- **Status:** open
- **Area:** ux
- **Files:** `T5KYC.tsx`, `src/lib/kyc-navigation.ts`, `onboarding/page.tsx`
- **Problem:** URL held in React state; after Didit return only `verificationSessionId` in query — “Reprendre” often unavailable.
- **Acceptance:** Persist URL in `sessionStorage` with session id; use `getKycSessionId()` on callback fallback.

---

## Low (2026-05-19 review)

### ONB-029 — Duplicate KYC UI (T5 vs portal modal)
- **Status:** open
- **Area:** maintenance
- **Files:** `T5KYC.tsx`, `KYCInitiationModal.tsx`
- **Problem:** Parallel polling, start, and stage UI; tone may still differ (tu/vous).
- **Acceptance:** Shared `useDiditKycPolling` (or equivalent) and copy pass.

### ONB-030 — T6 copy still references pending identity validation
- **Status:** open
- **Area:** ux / copy
- **Files:** `T6Dashboard.tsx`
- **Problem:** User reaches T6 only after approval but copy may still say “after validation”.
- **Acceptance:** Copy reflects approved state and next step (portal / first deposit).

### ONB-035 — T5 KYC poll errors hidden
- **Status:** open
- **Area:** ux
- **Files:** `T5KYC.tsx`
- **Problem:** `pollOnce` returns silently on `!res.ok`.
- **Acceptance:** Surface error state and retry.

### ONB-038 — Progress bar: T5 and T6 share same visible index
- **Status:** open
- **Area:** ux
- **Files:** `src/app/onboarding/page.tsx`
- **Problem:** Both map to same “step 5 of 5”.
- **Acceptance:** Distinct labels or six-step bar.

### ONB-039 — Manual test checklist / docs out of date
- **Status:** open
- **Area:** docs
- **Files:** This file, `project_docs/onboarding-replace-register-plan.md`
- **Problem:** Checklist still implied auto-charge after KYC and broken resume.
- **Acceptance:** Update checklist: manual Intouch on Sama Naffa; resume works; comms modal not full identity form.

### ONB-040 — `kyc-sync` intent updates duplicated in admin route
- **Status:** open
- **Area:** maintenance
- **Files:** `src/lib/kyc-sync.ts`, `src/app/api/admin/kyc/[id]/route.ts`
- **Problem:** Prisma + Drizzle paths; admin may duplicate deposit release logic.
- **Acceptance:** Single `releaseOnboardingDeposits(userId)` (or similar) used by webhook, poll, admin.

---

## Suggested fix order

### Original batch (mostly done)
1. ~~ONB-001~~ → manual Intouch confirm (documented)  
2. ~~ONB-002, ONB-003~~  
3. ~~ONB-004, ONB-017~~  
4. ~~ONB-005~~  
5. ~~ONB-006, ONB-007~~  
6. ONB-008 (tests)  
7. ~~ONB-009–ONB-022~~  

### 2026-05-19 (with [auth-issues.md](./auth-issues.md))
1. **Security:** ONB-023, ONB-024, ONB-025 + AUTH-001–003 (auth file)  
2. **Payments / data:** ONB-026, ONB-027, ONB-028  
3. **Portal UX:** ONB-031, ONB-032, ONB-033, ONB-034  
4. **Onboarding polish:** ONB-029, ONB-030, ONB-035–ONB-038  
5. **Quality:** ONB-008, ONB-039, ONB-040  

---

## Manual test checklist

- [ ] T0 → T1: simulation persisted; OTP; session after T1 (see AUTH-002 for session security)  
- [ ] T4: intent created, `awaitingKycApproval: true`, no charge  
- [ ] T5: Didit same-tab + callback; DB `kycStatus` → APPROVED  
- [ ] After KYC approve: intent `awaitingKycApproval: false`; **no auto-charge** — banner on Sama Naffa  
- [ ] Confirm deposit: Intouch modal; notification deep link → Sama Naffa (`confirmDeposit=1`)  
- [ ] Portal: communications modal (email + consents) until `meetsPortalCommunicationsRequirements`  
- [ ] Profile: DOB shown when synced from Didit  
- [ ] Security: cannot PATCH `kycApproved: true` without real KYC (**ONB-023**)  
- [ ] Security: PATCH profile / KYC status with another user’s id (**ONB-002/003 — should fail**)  
- [ ] Refresh mid-onboarding: resume from server progress (**ONB-005 — should pass**)  
- [ ] Notifications page: click routes to same URL as header dropdown (**ONB-031**)
