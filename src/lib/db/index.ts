import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as schema from './schema';

// Next.js does not override existing shell env vars with .env.local.
// In local branch-based Neon work, a stale exported DATABASE_URL can point the
// app at the wrong branch, so force the DB layer to honor .env.local.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local', override: true });
}

/** Placeholder only — satisfies module init during `next build` when env is unset. */
const BUILD_PLACEHOLDER_URL =
  'postgresql://build:build@127.0.0.1:5432/build?sslmode=disable';

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  // Vercel/CI builds import API routes before runtime env is guaranteed.
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return BUILD_PLACEHOLDER_URL;
  }
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString: resolveDatabaseUrl() });
export const db = drizzle(pool, { schema });

export * from './schema';
