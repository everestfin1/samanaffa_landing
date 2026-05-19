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

## Last review

| Date | Source |
|------|--------|
| 2026-05-18 | Initial onboarding + profile completion implementation |
| 2026-05-19 | Full flow + login/auth audit (`feat/onboarding-flow-mock` branch) |
