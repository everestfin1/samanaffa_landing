# Tracked issues

Issue trackers for known gaps, security findings, and follow-up work. IDs are stable across PRs and standups.

| Tracker | Prefix | Scope |
|---------|--------|--------|
| [onboarding-issues.md](./onboarding-issues.md) | `ONB-` | Onboarding T0–T6, KYC, deposit intent, portal profile/comms, notifications |
| [auth-issues.md](./auth-issues.md) | `AUTH-` | Login, OTP, NextAuth, password reset, admin auth, route protection |

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

**Priority:** `critical` | `high` | `medium` | `low`

## How to use

1. Pick the next item from **Suggested fix order** in each file (security first).
2. When fixing, set **Status** to `done` and add a one-line **Resolution** (PR or commit ref optional).
3. Do not renumber closed issues; append new IDs for new findings.

## ID collisions (do not renumber)

| ID | Issue A (status) | Issue B (status) |
|----|------------------|------------------|
| ONB-024 | Didit localhost callback (**done**) | Didit webhook session binding (**open**) |
| ONB-038 | KYC → login redirect (**done**) | Progress bar T5/T6 index (**open**) |

Refer by **title** in standups when ambiguous.

## Current sprint (2026-05-19)

**Product:** Portal login = phone + SMS OTP only. Onboarding signup still uses `signIn(register)` until AUTH-002 is fixed.

**Phase 1 (start here):**

| Priority | IDs | Theme |
|----------|-----|--------|
| P0 | AUTH-002, ONB-023, ONB-041, AUTH-001, AUTH-003 | Session integrity, KYC truth, IDOR, password surface |
| P1 | AUTH-004, AUTH-005, AUTH-020 | OTP brute-force + CSPRNG + mock OTP exposure |
| P2 | ONB-024, ONB-025, AUTH-013, AUTH-021, ONB-042 | Webhooks, consolidate auth, progress reliability |

Full phases: [auth-issues.md § Suggested fix order](./auth-issues.md#suggested-fix-order-implementation-sprint).

## Last review

| Date | Source |
|------|--------|
| 2026-05-18 | Initial onboarding + profile completion implementation |
| 2026-05-19 | Full flow + login/auth audit (`feat/onboarding-flow-mock`) |
| 2026-05-19 | Post-OTP-login orchestration review; sprint plan + ONB-041, AUTH-020/021/022 |
