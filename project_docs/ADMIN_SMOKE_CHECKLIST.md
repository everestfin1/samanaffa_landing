# Admin Smoke Checklist - Sama Naffa

This document provides a lightweight checklist to ensure the admin dashboard is functional after changes.

## 1. Global Components
- [ ] **Error Boundary**: Trigger a crash (e.g., throw in a component) and verify the "Recharger" button and "Afficher les détails" (dev-only) work.
- [ ] **Sidebar**: Verify collapse/expand works and persists across page reloads.
- [ ] **Auth**: Verify redirection to `/admin/login` if not authenticated.

## 2. Route Check (Navigation & Search)
For each route below, verify:
1. Page loads without errors.
2. Search bar filters results.
3. Status filter updates the URL and list.
4. Date picker updates the URL and list.
5. Pagination (Next/Prev/Page Size) works.

### Routes:
- [ ] **Dashboard** (`/admin`): KPIs match expectations.
- [ ] **Transactions** (`/admin/transactions`)
- [ ] **Utilisateurs** (`/admin/users`)
- [ ] **KYC** (`/admin/kyc`)
- [ ] **APE Subscriptions** (`/admin/ape-subscriptions`)
- [ ] **Sponsor Codes** (`/admin/sponsor-codes`)
- [ ] **PEE Leads** (`/admin/leads/pee`)
- [ ] **Abandoned Leads** (`/admin/leads/abandoned`)

## 3. Detail Views (Sheets)
- [ ] Open a row in **Transactions**: verify sheet displays correct data.
- [ ] Open a row in **Users**: verify detail view.
- [ ] Open a row in **APE Subscriptions**: verify amount and user info.
- [ ] Open a row in **PEE Leads**: verify lead details.

## 4. Workflows
- [ ] **Reconciliation**:
    - [ ] Select a CSV file.
    - [ ] Click "Analyser" -> verify StatsCards update.
    - [ ] Toggle checkboxes (exact matches should be auto-selected).
    - [ ] Click "Réconcilier" -> verify success alert.
- [ ] **KYC Review**: Verify document previews (Image/PDF) load correctly.

## 5. Technical Gates
- [ ] `bun run --filter @samanaffa/web type-check` passes.
- [ ] `bun run --filter @samanaffa/backend type-check` passes.
