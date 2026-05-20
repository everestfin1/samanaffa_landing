# Onboarding & profile completion — tracked issues

**Branch:** `feat/onboarding-flow-mock`  
**Recorded:** 2026-05-18 (initial), **2026-05-19** (reviews), **2026-05-19** (post-OTP-login orchestration review)  
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
| high     | 1 | ONB-008 (tests) |
| medium   | 10 | ONB-026–028, ONB-042, ONB-031–034, ONB-036–037 |
| low      | 6 | ONB-029, ONB-030, ONB-035, ONB-038 (bar), ONB-039, ONB-040 |

_Done:_ ONB-001–ONB-022 (except ONB-008 tests), ONB-038 (KYC login redirect), ONB-024 (localhost callback).

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
- **Status:** open
- **Area:** quality
- **Files:** (none yet)
- **Problem:** No unit/integration tests for onboarding APIs, KYC sync, profile completion rules.
- **Acceptance:** Tests for `meetsPortalProfileRequirements`, OTP create-account, `syncDiditDecision`, deposit intent lifecycle, progress PATCH auth rules.
- **Sprint:** P3.

---

## Medium (open)

### ONB-026 — T4 wallet choice vs Intouch-only confirmation
- **Status:** open
- **Area:** ux / payments
- **Files:** `T4Deposit.tsx`, `deposit-intent/route.ts`, `OnboardingDepositModal.tsx`
- **Problem:** T4 stores Orange/Wave/Free Money; post-KYC confirm always uses Intouch.
- **Acceptance:** Align copy (“paiement via Intouch”) or implement selected rail at confirm.

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
- **Status:** open
- **Area:** ux
- **Files:** `src/app/portal/notifications/page.tsx`, `NotificationDropdown.tsx`
- **Acceptance:** Shared `getActionUrl(notification)` used by both surfaces.

### ONB-032 — User notifications fail silently
- **Status:** open
- **Area:** reliability
- **Files:** `src/lib/user-notifications.ts`
- **Acceptance:** Return boolean or throw; optional retry; monitor failures in prod.

### ONB-033 — Profile communications modal only on dashboard
- **Status:** open
- **Area:** ux
- **Files:** `portal/dashboard/page.tsx`, `ProfileCompletionModal.tsx`, `portal-profile-completion.ts`
- **Acceptance:** Consistent gate before first deposit confirm.

### ONB-034 — Profile page allows editing fields filled by Didit
- **Status:** open
- **Area:** ux / compliance
- **Files:** `portal/profile/page.tsx`, `portal-profile-completion.ts`
- **Acceptance:** Lock identity fields or separate verified vs contact sections.

### ONB-036 — T3 `apply-formula` response not checked
- **Status:** open
- **Area:** bug
- **Files:** `T3Quiz.tsx`
- **Acceptance:** Block advance on non-OK response; show error.

### ONB-037 — Didit `verificationUrl` lost after redirect (T5 resume)
- **Status:** open
- **Area:** ux
- **Files:** `T5KYC.tsx`, `kyc-navigation.ts`, `onboarding/page.tsx`
- **Acceptance:** Persist URL in `sessionStorage` with session id.

---

## Low (open)

### ONB-029 — Duplicate KYC UI (T5 vs portal modal)
- **Status:** open
- **Area:** maintenance
- **Files:** `T5KYC.tsx`, `KYCInitiationModal.tsx`

### ONB-030 — T6 copy still references pending identity validation
- **Status:** open
- **Area:** ux / copy
- **Files:** `T6Dashboard.tsx`

### ONB-035 — T5 KYC poll errors hidden
- **Status:** open
- **Area:** ux
- **Files:** `T5KYC.tsx`

### ONB-038 — Progress bar: T5 and T6 share same visible index
- **Status:** open
- **Area:** ux
- **Files:** `onboarding/page.tsx`
- **Note:** Different from resolved ONB-038 (KYC → login redirect).

### ONB-039 — Manual test checklist / docs out of date
- **Status:** in_progress
- **Area:** docs
- **Files:** This file, `onboarding-replace-register-plan.md`, [auth-issues.md](./auth-issues.md)
- **Acceptance:** Checklists reflect OTP-only login, manual Intouch deposit, security sprint items.
- **Resolution (2026-05-19):** Checklist updated in this file; plan doc still needs pass.

### ONB-040 — `kyc-sync` intent updates duplicated in admin route
- **Status:** open
- **Area:** maintenance
- **Files:** `kyc-sync.ts`, `src/app/api/admin/kyc/[id]/route.ts`

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

---

## Manual test checklist

- [ ] T0 → T1: simulation persisted; OTP; session after T1 (**AUTH-002** must be fixed before trusting session)
- [ ] Cannot `signIn(register)` without valid post-`create-account` token (**AUTH-002**)
- [ ] T4: intent created, `awaitingKycApproval: true`, no auto-charge
- [ ] T5: Didit flow; DB `kycStatus` → APPROVED
- [ ] Cannot PATCH `kycApproved: true` without real KYC (**ONB-023**)
- [ ] Cannot upload/list KYC for another `userId` (**ONB-041**)
- [ ] After KYC approve: intent released; manual Intouch on Sama Naffa
- [ ] KYC return without session → `/login?callbackUrl=…` → resume T5/T6
- [ ] Logout → `/login` phone OTP → portal (**AUTH-018/019**)
- [ ] Refresh mid-onboarding: resume matches server (**ONB-005**; **ONB-042** no silent fail)
- [ ] Notifications page: same deep links as dropdown (**ONB-031**)
