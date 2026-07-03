# Admin back-office — tracked issues

**Recorded:** 2026-06-02 (legacy vs canvas admin parity audit)  
**Updated:** 2026-07-03 (Sama Naffa reconciliation, parrainage, canvas fixes)  
**Source:** Comparison of `/admin/legacy` vs route-based admin (`src/app/admin/(dashboard)/*`)  
**Canonical product scope:** [../01-product/07-active-product-scope.md](../01-product/07-active-product-scope.md)  
**Scope:** Admin UI, `AdminDataProvider`, `/api/admin/*` for **active** Sama Naffa operations  

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

**Priority:** `critical` | `high` | `medium` | `low`

---

## Product focus (July 2026)

**Active:** Sama Naffa core ops

1. Account creation (onboarding + users)  
2. KYC (Didit + admin exceptions)  
3. Naffa / `SAMA_NAFFA` accounts  
4. **Deposits** — transaction intents, Intouch manual confirmation (`ONB-001`)  
5. **Réconciliation Intouch** — CSV / date-range vs `transactionIntents`  
6. **Codes parrainage** — field agents (`field_agents`), attribution only  
7. Balances, notifications, acquisition (abandoned leads)

**Inactive (hidden nav, legacy routes):** APE Sénégal, PEE (pages remain for historical data)

**Later (not priority):** Withdrawals (client + admin)

---

## Canvas admin — current routes

| Route | Sama Naffa relevance | Status |
|-------|----------------------|--------|
| `/admin` | Overview, SN metrics, balance recalc | ADM-006 open |
| `/admin/users` | Accounts, KYC status, suspend/activate | done |
| `/admin/kyc` | Didit exceptions, preview, user filter | done |
| `/admin/transactions` | Deposits (Intouch), PROCESSING step | done |
| `/admin/reconciliation` | Intouch vs deposit intents | done |
| `/admin/sponsor-codes` | Field-agent referral codes | done |
| `/admin/notifications` | KYC comms | done |
| `/admin/settings` | SMS/email toggles (persisted) | done |
| `/admin/abandoned-leads` | Onboarding acquisition | ADM-007 open (UI polish) |
| `/admin/ape` | Inactive (hidden nav) | route fixed |
| `/admin/pee-leads` | Inactive (hidden nav) | route fixed |

---

## Summary (open items — Sama Naffa only)

| Priority | IDs | Theme |
|----------|-----|--------|
| P1 | ADM-006 | Recalculate all account balances on overview |
| P2 | ADM-007 | Abandoned leads canvas UI polish |
| P2 | ADM-008 | KYC exception workflow (optional) |
| — | ADM-018 | Withdrawals — deferred |

---

## Done since June 2026 audit

| ID / theme | Notes |
|------------|--------|
| ADM-004 | Transactions: PENDING → PROCESSING → COMPLETED in drawer |
| ADM-005 | User suspend/activate with reason |
| ADM-015 | KYC inline image preview (`KycDocumentPreview`) |
| ADM-016 | Users → KYC deep link (`?userId=`) |
| ADM-017 | Nav hides inactive APE/PEE; reconciliation + parrainage visible |
| Auth | Notifications/settings APIs use JWT bearer |
| Settings | `admin_notification_settings` persisted in Postgres |
| Pagination | `AdminDataProvider` loads all pages |
| Errors | `AdminFeedbackBanner` + mutation error surfacing |
| Réconciliation | Sama Naffa Intouch vs `transactionIntents` |
| Parrainage | `field_agents` CRUD at `/admin/sponsor-codes` |
| Legacy routes | PEE `PATCH` + `crmStatus`; APE `PATCH` subscription API |

---

## P1 — Users & ledger

### ADM-006 — Overview: recalculate all account balances
- **Status:** open
- **Priority:** high
- **Files:** `src/app/admin/(dashboard)/page.tsx` or `EditableDashboard.tsx`, `src/app/api/admin/accounts/recalculate-balances/route.ts`
- **Acceptance:** Admin action POSTing to recalculate API with clear success/error feedback.

---

## P2 — UX polish (active paths)

### ADM-007 — Abandoned leads: migrate to canvas UI
- **Status:** open
- **Priority:** medium
- **Files:** `src/components/admin/AbandonedLeadsTab.tsx`
- **Problem:** Logic OK; UI still legacy `admin-*` styling.
- **Acceptance:** Match canvas patterns; keep `GET/PATCH /api/admin/abandoned-leads`.

### ADM-008 — KYC: exception workflow polish (optional)
- **Status:** open
- **Priority:** medium
- **Acceptance:** Only if ops still handle many manual exceptions beyond Didit.

---

## Deferred — PM (not priority)

### ADM-018 — Withdrawals (client + admin)
- **Status:** open
- **Priority:** low (deferred)

---

## wontfix — Inactive products or obsolete

### ADM-001 — PEE leads: fix API and CRM fields
- **Status:** wontfix (product inactive) — **UI/API aligned** if route is accessed (`crmStatus`, `PATCH`)

### ADM-002 — Sponsor codes: CRUD in canvas admin
- **Status:** superseded — Sama Naffa uses `field_agents` at `/admin/sponsor-codes`

### ADM-003 — APE: provider transaction ID + status modal
- **Status:** wontfix (product inactive) — **PATCH route fixed** on `/admin/ape`

### ADM-009 — APE: CSV/Excel export
- **Status:** wontfix (APE inactive)

### ADM-010–014
- **Status:** wontfix (never implemented or cosmetic)

---

## Suggested fix order (remaining)

1. **ADM-006** — Recalculate balances  
2. **ADM-007** — Abandoned leads canvas UI  
3. **ADM-008** — KYC UX as needed  

---

## Last review

| Date | Notes |
|------|--------|
| 2026-06-02 | Initial tracker (legacy vs canvas audit). |
| 2026-07-03 | Sama Naffa reconciliation + parrainage; auth/settings/pagination/errors fixed; PEE/APE route alignment; orphan components removed. |
