# Admin Vue d'ensemble — configurable dashboard

## Overview

Admins customize the `/admin` overview via a bento grid stored in `dashboard_cards`. Layout uses **largeur** (`colSpan`, 1–12) and **hauteur** (`rowSpan`, 1–4).

## Data sources

All metrics and list types are defined in `src/lib/admin/dashboard-data-registry.ts`, grouped by domain:

| Category | Examples |
|----------|----------|
| Trésorerie | AUM, dépôts, investissements |
| Utilisateurs | Total clients |
| Transactions | En attente, complétées, activité récente |
| KYC | File documents, CTA `/admin/kyc` |
| APE | Souscriptions, montants, liste récente |
| PEE | Leads nouveaux / convertis |
| Codes parrain | Actifs, total |

The card editor applies **defaults** (type, icon, link, size) when the data source changes. **Modèles rapides** speed up adding common cards.

## API

`GET|POST|PUT|DELETE` `/api/admin/dashboard-config` — requires admin Bearer token (`verifyAdminAuth`).

- **GET**: returns all cards; seeds 8 defaults inside a transaction when the table is empty.
- **POST / PUT**: validated via `src/lib/admin/dashboard-config-validation.ts` (type, dataSource, spans, `/admin/…` links only).
- **PUT** batch: `{ cards: [{ id, order?, colSpan? }] }` for reorder.

## Schema

- Source of truth: `src/lib/db/schema.ts` (`dashboardCards` table, includes `rowSpan`).
- Migrations: `drizzle/0009_add_dashboard_cards.sql`, `drizzle/0010_dashboard_cards_row_span.sql` (ALTER for existing DBs).
- Regenerated snapshot: `drizzle/schema.ts` — keep in sync after schema changes.

## Frontend

- `EditableDashboard` — edit mode, hidden-cards section, `refreshDashboardCards()` (no full admin reload).
- `CardEditorModal` — `key={cardId|'new'}` remounts form state.
- `CardRenderers` — routing via `resolveDashboardCardVariant()`.

## Apply migrations

```bash
bun run db:migrate
# or for manual fix on existing DB:
# psql "$DATABASE_URL" -f drizzle/0010_dashboard_cards_row_span.sql
```
