# Admin back-office — tracked issues

**Recorded:** 2026-06-02 (legacy vs canvas admin parity audit)  
**Updated:** 2026-06-02 (PM: Sama Naffa–only ops; APE & PEE inactive)  
**Source:** Comparison of `/admin/legacy` vs route-based admin (`src/app/admin/(dashboard)/*`)  
**Canonical product scope:** [../01-product/07-active-product-scope.md](../01-product/07-active-product-scope.md)  
**Scope:** Admin UI, `AdminDataProvider`, `/api/admin/*` for **active** Sama Naffa operations  

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

**Priority:** `critical` | `high` | `medium` | `low`

---

## Product focus (June 2026 — PM)

**Active:** Sama Naffa core ops only

1. Account creation (onboarding + users)  
2. KYC (Didit + admin exceptions)  
3. Naffa / `SAMA_NAFFA` accounts (via onboarding & portal — no separate product admin yet)  
4. **Deposits** — transaction intents, Intouch manual confirmation (`ONB-001`)  
5. Balances, notifications, acquisition (abandoned leads)

**Inactive (no admin parity work):** APE Sénégal, PEE, APE réconciliation CSV, APE sponsor-code admin CRUD  

**Later (not priority):** Withdrawals (client + admin)

Do **not** start new work on ADM-001, ADM-002, ADM-003, ADM-009 unless PM reopens APE/PEE.

---

## Canvas admin — what matters now

| Route | Sama Naffa relevance | Backlog |
|-------|----------------------|---------|
| `/admin` | Overview, SN metrics, balance recalc | ADM-006 |
| `/admin/users` | Accounts, KYC status | ADM-005, ADM-016 |
| `/admin/kyc` | Didit exceptions | ADM-008, ADM-015 |
| `/admin/transactions` | **Deposits (Intouch)** — core | ADM-004 |
| `/admin/notifications` | KYC comms | — |
| `/admin/settings` | SMS/email toggles | — |
| `/admin/abandoned-leads` | Onboarding acquisition | ADM-007 |
| `/admin/ape` | **Inactive** | ADM-017 (hide nav) |
| `/admin/reconciliation` | **Inactive** (APE Intouch CSV) | ADM-017 |
| `/admin/pee-leads` | **Inactive** | ADM-017 |
| `/admin/sponsor-codes` | **Inactive** (APE codes) | ADM-017 |

---

## Summary (open items — Sama Naffa only)

| Priority | IDs | Theme |
|----------|-----|--------|
| P0 | ADM-004 | Transactions: PROCESSING step for Intouch deposits |
| P1 | ADM-005, ADM-006 | User suspend/activate; recalculate balances |
| P2 | ADM-007, ADM-008, ADM-015, ADM-016 | Abandoned leads UI; KYC polish |
| P2 | ADM-017 | De-scope admin nav (hide inactive products) — **after docs, with code** |
| — | ADM-018 | Withdrawals — **not priority** (PM) |
| — | ADM-001–003, ADM-009–014 | `wontfix` / superseded (see below) |

---

## P0 — Deposits & transactions (Intouch)

### ADM-004 — Transactions: PENDING → PROCESSING → COMPLETED
- **Status:** open
- **Priority:** critical
- **Area:** admin / payments
- **Files:** `src/app/admin/(dashboard)/transactions/page.tsx`, `src/app/api/admin/transactions/[id]/route.ts`
- **Problem:** Legacy table had **Traiter** (→ PROCESSING) and **Compléter** (→ COMPLETED). New admin only approves/rejects PENDING (COMPLETED / FAILED). Ops model is manual Intouch confirmation per deposit intent.
- **Acceptance:** Restore PROCESSING step (table and/or drawer). Scope **DEPOSIT** intents first; do not implement withdrawal flows (ADM-018).
- **Sprint:** P0

---

## P1 — Users & ledger

### ADM-005 — Users: suspend and activate
- **Status:** open
- **Priority:** high
- **Area:** admin / security
- **Files:** `src/app/admin/(dashboard)/users/page.tsx`, `src/app/api/admin/users/[id]/route.ts`
- **Problem:** API supports suspend/activate; new drawer only changes KYC status.
- **Acceptance:** Suspend (with reason) and activate in user drawer; refresh after action.
- **Sprint:** P1

### ADM-006 — Overview: recalculate all account balances
- **Status:** open
- **Priority:** high
- **Area:** admin / finance
- **Files:** `src/app/admin/(dashboard)/page.tsx` or `EditableDashboard.tsx`, `src/app/api/admin/accounts/recalculate-balances/route.ts`
- **Problem:** Legacy had **Recalculer tous les soldes**; new dashboard lacks it. Needed for `SAMA_NAFFA` accounts vs completed transaction intents.
- **Acceptance:** Admin action POSTing to recalculate API with clear success/error feedback.
- **Sprint:** P1

---

## P2 — UX polish (active paths)

### ADM-007 — Abandoned leads: migrate to canvas UI
- **Status:** open
- **Priority:** medium
- **Area:** admin / ux
- **Files:** `src/components/admin/AbandonedLeadsTab.tsx`, `src/app/admin/(dashboard)/abandoned-leads/page.tsx`
- **Problem:** Logic OK; UI still legacy `admin-*` styling.
- **Acceptance:** Match canvas patterns; keep `GET/PATCH /api/admin/abandoned-leads`.
- **Sprint:** P2

### ADM-008 — KYC: exception workflow polish (optional)
- **Status:** open
- **Priority:** medium
- **Area:** admin / compliance
- **Files:** `src/app/admin/(dashboard)/kyc/page.tsx`, `src/app/admin/(dashboard)/users/page.tsx`
- **Problem:** Legacy user-centric bulk approve; Didit owns happy path.
- **Acceptance:** Filter by user or link from user drawer — **only if** ops still handle many manual exceptions.
- **Sprint:** P2

### ADM-015 — KYC: inline image preview modal
- **Status:** open
- **Priority:** low
- **Files:** `src/app/admin/(dashboard)/kyc/page.tsx`
- **Acceptance:** Lightbox for images; PDF in new tab.
- **Sprint:** P2

### ADM-016 — Users: link to KYC for selected user
- **Status:** open
- **Priority:** low
- **Files:** `src/app/admin/(dashboard)/users/page.tsx`, `src/app/admin/(dashboard)/kyc/page.tsx`
- **Acceptance:** Deep link or filter from user drawer.
- **Sprint:** P2

### ADM-017 — De-scope admin nav (inactive products)
- **Status:** open
- **Priority:** medium
- **Area:** admin / product
- **Files:** `src/lib/admin/nav.ts`, `AdminDataProvider.tsx`, `AdminTopNav.tsx`, optional route guards
- **Problem:** Nav still shows APE, PEE, réconciliation, sponsor codes — PM confirmed inactive.
- **Acceptance:** Hide or archive nav groups for inactive lines; overview cards default to Sama Naffa metrics; document in [07-active-product-scope.md](../01-product/07-active-product-scope.md). Legacy `/admin/legacy` can remain until removed separately.
- **Sprint:** P2 — **code change after docs** (this issue)

---

## Deferred — PM (not priority)

### ADM-018 — Withdrawals (client + admin)
- **Status:** open
- **Priority:** low (deferred)
- **Area:** product
- **Reason:** PM: withdrawals handled in the future. Do not build admin withdrawal approval or transaction types beyond deposit-focused ops until specified.
- **Acceptance:** N/A until new spec.

---

## wontfix — Inactive products or obsolete

### ADM-001 — PEE leads: fix API and CRM fields
- **Status:** wontfix
- **Reason:** **PEE ops inactive** (PM, 2026-06-02). No admin CRM investment.

### ADM-002 — Sponsor codes: CRUD in canvas admin
- **Status:** wontfix
- **Reason:** **APE / sponsor-code ops inactive.** Codes are `ape_sponsor_codes`. Reopen only if PM defines Sama Naffa referral program + schema.

### ADM-003 — APE: provider transaction ID + status modal
- **Status:** wontfix
- **Reason:** **APE ops inactive.**

### ADM-009 — APE: CSV/Excel export and collected volume stat
- **Status:** wontfix
- **Reason:** **APE ops inactive.**

### ADM-010 — User archive and delete
- **Status:** wontfix
- **Reason:** API never existed in codebase.

### ADM-011 — User edit (profile editor)
- **Status:** wontfix
- **Reason:** Never implemented in legacy.

### ADM-012 — Notification delivery stats (placeholders)
- **Status:** wontfix
- **Reason:** Never wired.

### ADM-013 — Settings decorative stat cards only
- **Status:** wontfix
- **Reason:** Cosmetic only.

### ADM-014 — Full legacy KYC gallery as primary workflow
- **Status:** wontfix
- **Reason:** Didit-first; exception-only admin.

---

## Suggested fix order (Sama Naffa only)

1. **ADM-004** — Transaction PROCESSING (deposits / Intouch)  
2. **ADM-005** — User suspend/activate  
3. **ADM-006** — Recalculate balances  
4. **ADM-007** — Abandoned leads canvas UI  
5. **ADM-017** — Hide inactive nav (code)  
6. **ADM-008 / ADM-015 / ADM-016** — KYC UX as needed  

**Do not schedule:** ADM-001, ADM-002, ADM-003, ADM-009, ADM-018 (until PM).

---

## Reference

| Item | Location |
|------|----------|
| Product scope | [07-active-product-scope.md](../01-product/07-active-product-scope.md) |
| Canvas layout | `src/app/admin/(dashboard)/layout.tsx` |
| Nav config | `src/lib/admin/nav.ts` |
| Legacy admin | `src/app/admin/legacy/page.tsx` (deprecated for ops) |

---

## Last review

| Date | Notes |
|------|--------|
| 2026-06-02 | Initial tracker (legacy vs canvas audit). |
| 2026-06-02 | PM focus: Sama Naffa only; APE/PEE wontfix; withdrawals deferred; fix order rewritten. |
