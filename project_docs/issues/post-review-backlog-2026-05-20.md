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
| Deprecate Emprunt obligataire | **flag ready** | Set `NEXT_PUBLIC_APE_DEPRECATED=true` on Vercel to hide nav/dashboard card and show sunset on `/portal/ape` + `/souscrire-ape`. Marketing/FAQ copy not stripped (follow-up). |
| Broader API integration tests | optional | OTP/rate-limit E2E not added |

### Enable APE sunset (ops)

```bash
# Vercel → Environment Variables (Preview + Production when ready)
NEXT_PUBLIC_APE_DEPRECATED=true
```

---

## Reference

- Review validated 2026-05-20 in agent session; overstated items (M6 profile 400, M5 `active` flag) intentionally omitted here.
