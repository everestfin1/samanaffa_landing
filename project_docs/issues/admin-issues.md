# Admin back-office — tracked issues

**Recorded:** 2026-06-02 (legacy vs canvas admin parity audit)  
**Updated:** 2026-07-03 (ADM-006–008 closed; Sama Naffa ops complete)  
**Source:** Comparison of `/admin/legacy` vs route-based admin (`src/app/admin/(dashboard)/*`)  
**Canonical product scope:** [../01-product/07-active-product-scope.md](../01-product/07-active-product-scope.md)  

**Status legend:** `open` | `in_progress` | `done` | `wontfix`

---

## Product focus (July 2026)

**Active:** Sama Naffa core ops — onboarding, KYC, deposits, Intouch reconciliation, codes parrainage, abandoned leads, balances.

**Inactive (hidden nav):** APE Sénégal, PEE

**Deferred:** Withdrawals (ADM-018)

---

## Canvas admin — route status

| Route | Status |
|-------|--------|
| `/admin` | done (incl. balance recalc) |
| `/admin/users` | done |
| `/admin/kyc` | done (exceptions + batch dossier) |
| `/admin/transactions` | done |
| `/admin/reconciliation` | done |
| `/admin/sponsor-codes` | done |
| `/admin/notifications` | done |
| `/admin/settings` | done |
| `/admin/abandoned-leads` | done |
| `/admin/ape`, `/admin/pee-leads` | inactive; routes aligned |

---

## Open items

| ID | Priority | Theme |
|----|----------|--------|
| ADM-018 | low (deferred) | Withdrawals — client + admin |

---

## Closed (July 2026)

| ID | Summary |
|----|---------|
| ADM-006 | Overview **Soldes** button → `POST /api/admin/accounts/recalculate-balances`; shared feedback banner |
| ADM-007 | Abandoned leads canvas UI (`DetailDrawer`, bento stats, `authedFetch`) |
| ADM-008 | KYC **Exceptions manuelles** filter; user dossier `?userId=` + batch approve via `/api/admin/kyc/batch` |
| ADM-004–005, 015–017 | See prior changelog in git history |

---

## wontfix — Inactive / obsolete

ADM-001, ADM-003, ADM-009–014 — inactive products or never implemented.  
ADM-002 superseded by `field_agents` / `/admin/sponsor-codes`.

---

## Last review

| Date | Notes |
|------|--------|
| 2026-07-03 | ADM-006–008 implemented; admin canvas parity for active Sama Naffa ops. |
