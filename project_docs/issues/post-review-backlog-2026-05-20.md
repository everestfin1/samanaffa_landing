# Post-review backlog (2026-05-20+)

Deferred after code review of Phases 1–4 + ONB-026/029/039/040.  
**Fixed same day:** H4 (T3 quiz), H5 (KYC poll UI), H1 (JWT sessionVersion throttle), M4 (notification deep links).

**2026-05-21 review** (Didit desktop SDK + signup/comms): **ONB-048–052**, **AUTH-026** — done in main trackers.

**2026-05-23:** ONB-044-portal, ONB-046, ONB-047, review hardening (rate-limit, check-availability, KYC hook).

Use this file for remaining product/env toggles.

---

## Auth (`auth-issues.md`) — done

| ID | Status | Notes |
|----|--------|-------|
| AUTH-023 | done | `users.sessionVersion` column + migration |
| AUTH-024 | done | `formatTimeRemaining` French in `useSessionTimeout.ts` |
| AUTH-025 | done | `sanitizeNotificationActionUrl` on write + read; **2026-05-23** kyc-sync notifications sanitized |

---

## Onboarding / portal — done

| ID | Status | Notes |
|----|--------|-------|
| ONB-043 | done | `onBeforeConfirm` on Sama Naffa deposit card |
| ONB-044-portal | done | `openDiditInNewTab` on portal KYC modal |
| ONB-045 | done | `ONBOARDING_V2\|` scope on deposit intents |
| ONB-046 | done | Payment labels + lazy backfill |
| ONB-047 | done | `release-deposit` + T6 readiness |
| ONB-008 | done | Vitest: kyc-session, auth-session, notification URLs, payment-method-label |
| ONB-048–052 | done | See [onboarding-issues.md](./onboarding-issues.md) |
| AUTH-026 | done | No runtime Didit `capture_method` PATCH from public KYC start |

---

## Product / features

| Item | Status | Notes |
|------|--------|-------|
| Didit web browser verification | done | SDK modal desktop; redirect mobile |
| KYC capture-only | done (Didit) + app | Didit workflow configured in console. **App (2026-05-23):** profile page — file upload removed; Didit modal CTA. Legacy `/register` + `Step4Documents` unchanged (redirects to `/onboarding`). |
| Deprecate Emprunt obligataire (portal) | **optional env** | `NEXT_PUBLIC_APE_DEPRECATED=true` hides client APE nav/routes. **Not the same as admin ops** — see below. |
| Broader API integration tests | optional | OTP/rate-limit E2E not added |

### APE & PEE — business de-scope (2026-06-02)

**PM decision:** APE and PEE are **no longer active** for operations. Engineering focus is **Sama Naffa** (accounts, KYC, Naffa, deposit/Intouch transactions). Withdrawals later.

| Area | Action |
|------|--------|
| Admin backlog | ADM-001, ADM-002, ADM-003, ADM-009 → **wontfix** in [admin-issues.md](./admin-issues.md) |
| Canonical scope | [07-active-product-scope.md](../01-product/07-active-product-scope.md) |
| Portal (optional) | Still valid to set `NEXT_PUBLIC_APE_DEPRECATED=true` to hide client APE UI |
| Code (later) | ADM-017: hide admin nav for APE / PEE / réconciliation / sponsor codes |

```bash
# Optional — client portal only (Preview + Production)
NEXT_PUBLIC_APE_DEPRECATED=true
```

---

## Reference

- Review validated 2026-05-20 in agent session; overstated items (M6 profile 400, M5 `active` flag) intentionally omitted here.
