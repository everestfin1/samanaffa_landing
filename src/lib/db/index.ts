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

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Create a connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the Drizzle instance
export const db = drizzle(pool, { schema });

// Export schema for convenience
export * from './schema';

