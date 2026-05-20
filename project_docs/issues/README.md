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
| ONB-024 | Didit localhost callback (**done**) | Didit webhook session binding (**done**) |
| ONB-038 | KYC → login redirect (**done**) | Progress bar T5/T6 index (**done**) |

Refer by **title** in standups when ambiguous.

## Current sprint (2026-05-20)

**Product:** Portal login = phone + SMS OTP only. Onboarding uses post-signup token (AUTH-002 done). Phases 1–4 largely complete.

**Remaining (open):**

| Priority | IDs | Theme |
|----------|-----|--------|
| high | ONB-008 | Onboarding/KYC automated tests |
| medium | AUTH-022, AUTH-023 | Upstash rate limits; `sessionVersion` column |
| backlog | ONB-043–047, AUTH-024–025 | [post-review-backlog-2026-05-20.md](./post-review-backlog-2026-05-20.md) |

**Next product (not tracked yet):** Didit web browser verification; deprecate Emprunt obligataire.

Full history: [auth-issues.md § Suggested fix order](./auth-issues.md#suggested-fix-order-implementation-sprint), [onboarding-issues.md § Suggested fix order](./onboarding-issues.md#suggested-fix-order).

## Last review

| Date | Source |
|------|--------|
| 2026-05-18 | Initial onboarding + profile completion implementation |
| 2026-05-19 | Full flow + login/auth audit (`feat/onboarding-flow-mock`) |
| 2026-05-19 | Post-OTP-login orchestration review; sprint plan + ONB-041, AUTH-020/021/022 |
| 2026-05-20 | Phases 1–4; ONB-026/029/039/040; review fixes H4/H5/H1/M4; [backlog](./post-review-backlog-2026-05-20.md) |
