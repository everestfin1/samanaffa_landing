# Admin Vue d'ensemble — configurable dashboard

## Overview

Admins customize the `/admin` overview via a bento grid stored in `dashboard_cards`. Layout uses **largeur** (`colSpan`, 1–12) and **hauteur** (`rowSpan`, 1–4). Each row track is 180px (`gap-5` between rows); `dashboardGridRowStyle()` sets `grid-row: span N` plus an explicit `minHeight` so height changes are visible.

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
