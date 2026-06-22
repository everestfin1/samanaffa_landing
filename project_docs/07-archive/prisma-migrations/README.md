# Historical Prisma migrations (archived)

**Status:** Legacy — not used at runtime. Schema changes are managed via Drizzle (`drizzle/*.sql`, `src/lib/db/schema.ts`).

These SQL files document the database evolution from the original Prisma migration era (Sept–Oct 2025). Kept for audit and rollback reference only.

## Seeding

Admin bootstrap:

```bash
npm run db:seed
```

Runs `scripts/db-seed.ts` (Drizzle).

## Active database tooling

```bash
npm run db:generate   # drizzle-kit generate
npm run db:migrate    # apply drizzle migrations
npm run db:studio     # Drizzle Studio
```
