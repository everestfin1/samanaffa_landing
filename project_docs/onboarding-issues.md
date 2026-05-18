# Onboarding & profile completion — tracked issues

**Branch:** `feat/onboarding-flow-mock`  
**Recorded:** 2026-05-18  
**Source:** Code review after T0–T6 onboarding + portal profile completion work  
**Scope:** `src/app/onboarding/`, `src/components/onboarding/`, `src/app/api/onboarding/`, `src/lib/kyc-sync.ts`, `src/lib/portal-profile-completion.ts`, portal profile modal

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

---

## Summary

| Severity | Open |
|----------|------|
| critical | 3 |
| high     | 5 |
| medium   | 9 |
| low      | 5 |

---

## Critical

### ONB-001 — Deposit never executes after KYC approval
- **Status:** open
- **Area:** payments / kyc-sync
- **Files:** `src/lib/kyc-sync.ts`, `src/app/api/onboarding/deposit-intent/route.ts`
- **Problem:** `deposit-intent` documents auto-trigger on KYC approval. On `APPROVED`, `syncDiditDecision` only sets `awaitingKycApproval: false` — no Intouch (or other) payment is started.
- **Impact:** Users see “dépôt en cours” / notifications promising processing; no money movement.
- **Acceptance:** Approved KYC triggers payment (or intent moves to a payable state) for pending onboarding deposits; copy matches real behavior.

### ONB-002 — Unauthenticated PATCH `/api/onboarding/profile`
- **Status:** open
- **Area:** security
- **Files:** `src/app/api/onboarding/profile/route.ts`, `T2FirstName.tsx`, `T3Quiz.tsx`
- **Problem:** Endpoint trusts client-supplied `userId` with no session check (comment: “mock flow”).
- **Impact:** IDOR — anyone with a UUID can update another user’s name / `investorProfile`.
- **Acceptance:** Require session; `userId` must match `session.user.id` (or drop endpoint in favor of `/api/users/profile`).

### ONB-003 — KYC status poll accepts arbitrary `userId`
- **Status:** open
- **Area:** security
- **Files:** `src/app/api/onboarding/kyc/status/route.ts`, `T5KYC.tsx`
- **Problem:** `GET …/kyc/status?sessionId=&userId=` has no auth; `userId` is passed to `syncDiditDecision`.
- **Impact:** With a leaked Didit `sessionId`, KYC outcome could be synced to the wrong user.
- **Acceptance:** Authenticated request; `userId` derived from session and matched to session owner / `vendor_data`.

---

## High

### ONB-004 — Onboarding completable without full KYC approval
- **Status:** open
- **Area:** ux / kyc
- **Files:** `T5KYC.tsx`, `T6Dashboard.tsx`, `onboarding/page.tsx`
- **Problem:** `in_review` shares the same “Terminer” path as `approved`.
- **Impact:** Users reach T6 / portal while KYC may still be pending; T6 copy says “Identité vérifiée”.
- **Acceptance:** Gate T6 on `approved` only, or distinct copy/flows for `in_review`.

### ONB-005 — No resume after refresh or tab close
- **Status:** open
- **Area:** ux / state
- **Files:** `src/app/onboarding/page.tsx`
- **Problem:** Step state (`userId`, `formula`, `depositAmount`, etc.) is client-only.
- **Impact:** Refresh mid-flow loses progress despite valid session in DB.
- **Acceptance:** Persist step (and key fields) server-side; restore on return for logged-in users.

### ONB-006 — T0 simulation data not persisted on user
- **Status:** open
- **Area:** data
- **Files:** `T0Simulator.tsx`, `T1Phone.tsx`, `create-account/route.ts`
- **Problem:** Simulation stored in `registration_session` only; not copied to user on `verify-otp`.
- **Impact:** T0 engagement / personalization data lost.
- **Acceptance:** Save simulation on user or account metadata at account creation.

### ONB-007 — Quiz formula not applied to Sama Naffa account
- **Status:** open
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
- **Status:** open
- **Area:** ux
- **Files:** `src/app/onboarding/page.tsx`
- **Problem:** `visibleStepIndex` maps both T1 and T2 to `1` (“Étape 1 sur 4”).
- **Acceptance:** Five visible steps or merge T1+T2 in UX so progress advances per screen.

### ONB-010 — T2 shows “Données de démonstration” footer
- **Status:** open
- **Area:** ux / copy
- **Files:** `T2FirstName.tsx`
- **Problem:** Demo disclaimer on production registration screen.
- **Acceptance:** Remove or replace with real legal/helper copy.

### ONB-011 — Inconsistent tu/vous tone
- **Status:** open
- **Area:** ux / copy
- **Files:** `T2FirstName.tsx` vs T3–T5
- **Problem:** T2 formal “vous”; later steps informal “tu”.
- **Acceptance:** Single voice across onboarding (per product decision).

### ONB-012 — Mandatory profile modal UX (long form, no progress)
- **Status:** open
- **Area:** ux
- **Files:** `ProfileCompletionModal.tsx`, `portal/dashboard/page.tsx`
- **Problem:** Non-dismissible modal with many fields; no completion progress or escape to profile page.
- **Acceptance:** Progress indicator and/or link to `/portal/profile`; mobile-friendly layout review.

### ONB-013 — Referral “2 000 FCFA” on T6 not implemented
- **Status:** open
- **Area:** product
- **Files:** `T6Dashboard.tsx`
- **Problem:** WhatsApp share only; no referral tracking or payout.
- **Acceptance:** Implement referral program or remove/reword reward promise.

### ONB-014 — Didit `window.open` fragile (popup blockers)
- **Status:** open
- **Area:** ux
- **Files:** `T5KYC.tsx`
- **Problem:** New tab may be blocked; limited user feedback.
- **Acceptance:** Detect blocked popup; offer same-tab redirect or clear recovery steps.

### ONB-015 — KYC callback `window.close()` unreliable
- **Status:** open
- **Area:** ux
- **Files:** `src/app/onboarding/kyc-callback/page.tsx`
- **Problem:** Auto-close only works for script-opened windows.
- **Acceptance:** Clear manual instructions; optional deep link back to onboarding with session.

### ONB-016 — Profile modal form sync edge cases
- **Status:** open
- **Area:** bug
- **Files:** `ProfileCompletionModal.tsx`
- **Problem:** `useEffect` depends on `isOpen` + `initialData` but `buildFormData` not stable in deps.
- **Acceptance:** Stable initializer or explicit deps; verify reopen after partial save.

### ONB-017 — Portal dashboard does not gate on KYC status
- **Status:** open
- **Area:** ux
- **Files:** `src/app/portal/dashboard/page.tsx`
- **Problem:** Full dashboard shown regardless of `kycStatus` / pending deposit.
- **Acceptance:** Banner or gated actions until KYC approved and profile complete.

---

## Low

### ONB-018 — `T6Dashboard` uses `@ts-ignore` for Confetti
- **Status:** open
- **Area:** code quality
- **Files:** `T6Dashboard.tsx`

### ONB-019 — T5 title uses `h2` while other steps use `p`
- **Status:** open
- **Area:** ux / consistency
- **Files:** `T5KYC.tsx`

### ONB-020 — `T4Deposit` unused `userId` prop
- **Status:** open
- **Area:** code quality
- **Files:** `T4Deposit.tsx`, `onboarding/page.tsx`

### ONB-021 — `onboarding-replace-register-plan.md` outdated
- **Status:** open
- **Area:** docs
- **Files:** `project_docs/onboarding-replace-register-plan.md`
- **Problem:** Still describes moving T2–T6 to portal after T1; implementation keeps full in-flow onboarding.
- **Acceptance:** Update “Current status” and critical tasks to match code.

### ONB-022 — `MOCK_OTP` must not ship to production
- **Status:** open
- **Area:** ops / security
- **Files:** `src/lib/notifications.ts`, `create-account/route.ts`, `T1Phone.tsx`
- **Problem:** Dev mock OTP in API/UI if env misconfigured.
- **Acceptance:** Enforce env checks in prod builds; hide dev UI when disabled.

---

## Suggested fix order

1. ONB-001 (deposit execution)  
2. ONB-002, ONB-003 (API security)  
3. ONB-004, ONB-017 (KYC gating + honest copy)  
4. ONB-005 (resume flow)  
5. ONB-006, ONB-007 (data + product wiring)  
6. ONB-008 (tests)  
7. UX/copy batch: ONB-009–ONB-016  
8. ONB-021, ONB-022 (docs + ops)

---

## Manual test checklist

- [ ] T0 → T1: simulation sent; OTP; session after T1  
- [ ] T4: intent created, `awaitingKycApproval: true`, no charge  
- [ ] T5: Didit + poll; DB `kycStatus` updates  
- [ ] After KYC approve: deposit actually processes (**currently expected to fail**)  
- [ ] Portal: modal until profile requirements met  
- [ ] Security: PATCH profile / KYC status with another user’s id (**should fail after ONB-002/003**)  
- [ ] Refresh mid-onboarding (**currently expected broken — ONB-005**)
