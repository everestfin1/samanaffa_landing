import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

const isBrowser = typeof window !== 'undefined'

let db: ReturnType<typeof drizzle>

if (!isBrowser) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Create a connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Create the Drizzle instance
  db = drizzle(pool, { schema });
} else {
  db = undefined as unknown as ReturnType<typeof drizzle>
}

export { db }

// Export schema for convenience
export * from './schema';

