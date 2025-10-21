import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Create a connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the Drizzle instance
export const db = drizzle(pool, { schema });

// Export schema for convenience
export * from './schema';

