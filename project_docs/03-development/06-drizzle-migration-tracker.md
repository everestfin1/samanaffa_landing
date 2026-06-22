# Drizzle migration tracker

**Goal:** Remove `@/lib/prisma` shim and use native Drizzle queries everywhere.

**Source of truth:** `src/lib/db/schema.ts` + `drizzle/*.sql`

**Status:** ✅ **Complete** (2026-06-22)

- All `src/` API routes and lib modules use native Drizzle.
- `src/lib/prisma.ts` and `src/lib/db/helpers.ts` (Prisma compatibility layer) **deleted**.
- Dev scripts migrated (including phone utilities).
- Seed moved to `scripts/db-seed.ts` (`npm run db:seed`).
- Historical Prisma SQL archived under `project_docs/07-archive/prisma-migrations/`.

---

## Pattern

```typescript
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);

await db.update(users).set({ ...patch, updatedAt: new Date() }).where(eq(users.id, id));
```

For transactions, use `db.transaction(async (tx) => { ... })`.

---

## Archived reference

| Path | Purpose |
|------|---------|
| `project_docs/07-archive/prisma-migrations/migrations/` | Pre-Drizzle SQL history |
| `project_docs/02-architecture/03-database-migration.md` | Migration decision record |
