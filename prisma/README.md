# Prisma Migration History

This folder contains historical Prisma migration files for reference purposes.

## Status: ⚠️ Legacy (No longer active)

**The application has been migrated to Drizzle ORM** as of October 21, 2025.

## What's in this folder:

### `migrations/` - Historical database migrations
These SQL migration files document the evolution of the database schema. They are kept for:
- Historical reference
- Understanding schema changes over time
- Rollback reference if needed

**Note**: These migrations were created by Prisma and are no longer actively used. New schema changes should be managed through Drizzle migrations.

### `seed.ts` - Database seeding script
Updated to use Drizzle ORM. Run with:
```bash
bun run db:seed
```

This script creates the initial admin user.

## Current Database Management

The application now uses **Drizzle ORM** for all database operations:
- **Schema**: `/src/lib/db/schema.ts`
- **Client**: `/src/lib/db/index.ts`
- **Config**: `/drizzle.config.ts`

### Drizzle Commands:
```bash
# Generate migrations from schema
bun run db:generate

# Push schema to database
bun run db:push

# Run migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

## Why We Migrated

The migration from Prisma to Drizzle was necessary to:
1. ✅ Fix Prisma Query Engine deployment issues on Vercel
2. ✅ Reduce bundle size and improve cold start times
3. ✅ Better serverless compatibility
4. ✅ Eliminate platform-specific binary dependencies

## Can I delete this folder?

### Safe to delete:
- ❌ `schema.prisma` - Already removed
- ❌ `generated/` - Already removed

### Keep for reference:
- ✅ `migrations/` - Keep as historical record
- ✅ `seed.ts` - Active seeding script (now uses Drizzle)
- ✅ This README

If you need to completely remove Prisma traces, you can delete the entire `prisma/` folder, but it's recommended to keep the migration history for documentation purposes.

