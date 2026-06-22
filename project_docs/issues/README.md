# Tracked issues

Issue trackers for known gaps, security findings, and follow-up work. IDs are stable across PRs and standups.

| Tracker | Prefix | Scope |
|---------|--------|--------|
| [onboarding-issues.md](./onboarding-issues.md) | `ONB-` | Onboarding T0–T6, KYC, deposit intent, portal profile/comms, notifications |
| [auth-issues.md](./auth-issues.md) | `AUTH-` | Login, OTP, NextAuth, password reset, admin auth, route protection |
| [admin-issues.md](./admin-issues.md) | `ADM-` | Canvas admin — **Sama Naffa ops only** (users, KYC, deposits/Intouch, balances) |
| [../01-product/07-active-product-scope.md](../01-product/07-active-product-scope.md) | — | **Canonical PM scope** (June 2026): active vs inactive product lines |

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

## Current focus (2026-06-02)

**Product (PM):** **Sama Naffa only** — account creation + KYC (Didit), Naffa accounts, **deposit** transaction tracking (Intouch manual confirm). **APE & PEE admin ops inactive.** **Withdrawals:** later, not priority.

**Canonical scope:** [07-active-product-scope.md](../01-product/07-active-product-scope.md)

**Admin backlog ([admin-issues.md](./admin-issues.md)) — do first:**

| Priority | IDs | Theme |
|----------|-----|--------|
| P0 | ADM-004 | Transactions PROCESSING for deposits |
| P1 | ADM-005, ADM-006 | User suspend/activate; recalculate balances |
| P2 | ADM-007, ADM-017 | Abandoned leads UI; hide APE/PEE/réconciliation/sponsor nav |

**Do not schedule:** ADM-001 (PEE), ADM-002 (sponsor), ADM-003/009 (APE) — **wontfix** per PM.

---

## Prior sprint context (2026-05)

**Product:** Portal login = phone + SMS OTP only. Onboarding T0–T6 + Didit KYC. Manual Intouch deposits (`ONB-001`).

**Done 2026-05-23:** ONB-044-portal, ONB-046, ONB-047. **Done 2026-05-21:** AUTH-022–026, ONB-048–053.

**Superseded:** “Enable APE sunset via env only” — full **APE/PEE ops de-scope** documented 2026-06-02 (portal may still use `NEXT_PUBLIC_APE_DEPRECATED` when hiding client UI).

Full history: [auth-issues.md § Suggested fix order](./auth-issues.md#suggested-fix-order-implementation-sprint), [onboarding-issues.md § Suggested fix order](./onboarding-issues.md#suggested-fix-order), [admin-issues.md § Suggested fix order](./admin-issues.md#suggested-fix-order).

## Last review

| Date | Source |
|------|--------|
| 2026-05-18 | Initial onboarding + profile completion implementation |
| 2026-05-19 | Full flow + login/auth audit (`feat/onboarding-flow-mock`, now merged into `staging`) |
| 2026-05-19 | Post-OTP-login orchestration review; sprint plan + ONB-041, AUTH-020/021/022 |
| 2026-05-20 | Phases 1–4; ONB-026/029/039/040; review fixes H4/H5/H1/M4; [backlog](./post-review-backlog-2026-05-20.md) |
| 2026-05-21 | Step-by-step fix sprint: ONB-048–053, ONB-043, AUTH-026 |
| 2026-06-02 | Admin legacy vs canvas audit; [admin-issues.md](./admin-issues.md) (ADM-001–018) |
| 2026-06-02 | PM: Sama Naffa–only ops; [07-active-product-scope.md](../01-product/07-active-product-scope.md); APE/PEE ADM items wontfix |
| 2026-06-22 | Git workflow cleanup: `staging` integration branch; `feat/onboarding-flow-mock` archived ([07-git-workflow.md](../03-development/07-git-workflow.md)) |
