# Active product scope — Sama Naffa ops (PM, June 2026)

**Status:** Current business direction  
**Last updated:** 2026-06-22  
**Audience:** Engineering, PM, support — use this before prioritizing admin, portal, or API work.

---

## Executive summary

**Sama Naffa épargne** is the only active product line for day-to-day operations.  
**APE Sénégal (Emprunt obligataire)** and **PEE (Plan Épargne Entreprise)** are **no longer active** for business or admin ops — code and docs may still exist for historical data; do not prioritize new features or admin parity for those surfaces unless PM reopens them.

---

## In scope — Sama Naffa core ops

What “basic essence” means for engineering and admin:

| Capability | Client journey | Admin / back-office |
|------------|----------------|---------------------|
| **Account creation** | Onboarding T0–T6, phone OTP login | Users list, onboarding/abandoned leads (acquisition) |
| **KYC** | Didit (T5 + portal resume) | KYC exceptions, user KYC status, notification settings |
| **Naffa creation** | Formula choice, `SAMA_NAFFA` accounts, portal Sama Naffa | Accounts implied via users/transactions (no separate “Naffa admin” product yet) |
| **Versements (Intouch)** | Deposit intents (client copy: *versement*), manual confirmation model | **Transactions**: track intents, PENDING → PROCESSING → COMPLETED, align with Intouch |
| **Balances** | Portal display from completed intents | Recalculate balances tool when ledger drifts |
| **Notifications** | Email/SMS on KYC, etc. | Manual KYC notifications + `/admin/settings` toggles |

### Explicitly not priority (now)

| Topic | Notes |
|-------|--------|
| **Withdrawals** | Future capability; no admin or client implementation priority until PM defines flow. |
| **APE subscriptions** | No new subs ops; réconciliation CSV was APE-specific. |
| **PEE leads** | No CRM ops in admin. |
| **APE sponsor codes (admin CRUD)** | Tied to inactive APE line; onboarding may still accept referral URL params — no admin investment until a **Sama Naffa** referral model exists. |
| **Full manual KYC gallery** | Didit-first; admin = exceptions only. |

---

## Inactive product lines (historical)

| Product | Public / portal | Admin routes (today) | Engineering stance |
|---------|-----------------|----------------------|--------------------|
| **APE Sénégal** | Hidden by default (`NEXT_PUBLIC_APE_DEPRECATED` unset or not `false`); public routes redirect to Sama Naffa. Set env to `false` for legacy internal testing only. | `/admin/ape`, `/admin/reconciliation`, `/admin/sponsor-codes` | **No new ops features.** Optional follow-up: hide nav + read-only archive. |
| **PEE** | `/pee` marketing form may still submit | `/admin/pee-leads` | **No admin fixes or CRM parity.** |

Admin UI: route-based shell at `/admin/*` (`src/app/admin/(dashboard)`) is the sole ops interface for Sama Naffa.

### Engineering direction (data layer)

**Target:** Drizzle-only (`src/lib/db/schema.ts` + `drizzle/` migrations). Prisma (`@prisma/client`, `src/lib/prisma`) remains in some API routes until migrated — do not add new Prisma usage; port callers to Drizzle when touching those files.

---

## Related documentation

| Doc | Role |
|-----|------|
| [sama-naffa-user-flows.pdf](./sama-naffa-user-flows.pdf) | Client + admin flows for **active** journeys |
| [05-kyc-onboarding.md](./05-kyc-onboarding.md) | Historical mockups; actual build = Didit T5 |
| [02-ape-senegal-context.md](./02-ape-senegal-context.md) | **Archive** — APE program context only |
| [../Mise a Niveau Lexicale SamaNaffa.docx](../Mise%20a%20Niveau%20Lexicale%20SamaNaffa.docx) | **Compliance** — lexical audit EF/DSI/2026/LEX-SN-001 (June 2026) |
| [../issues/admin-issues.md](../issues/admin-issues.md) | Engineering backlog (`ADM-*`) aligned to this scope |
| [../issues/post-review-backlog-2026-05-20.md](../issues/post-review-backlog-2026-05-20.md) | May 2026 sprint notes (APE flag superseded by full de-scope) |

---

## Changelog

| Date | Decision |
|------|----------|
| 2026-06-22 | Dev: removed admin mock/legacy UI, dead registration steps, stale drizzle snapshots; Drizzle-only migration noted. |
| 2026-06-22 | Dev: public site mono-produit Sama Naffa; APE deprecated by default via env; client copy uses *versement* (admin may still say *dépôt*). |
| 2026-06-02 | PM: sole focus Sama Naffa ops (accounts, KYC, Naffa, deposit/Intouch transactions). APE & PEE ops inactive. Withdrawals later. |
