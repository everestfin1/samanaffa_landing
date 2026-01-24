import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const isBrowser = typeof globalThis !== 'undefined' && 'window' in globalThis

let _db: ReturnType<typeof drizzle> | undefined

function initDb(): ReturnType<typeof drizzle> {
  if (_db) return _db

  if (isBrowser) {
    throw new Error('Database client cannot be used in the browser')
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  // Debug: log the database being connected to
  const dbUrl = process.env.DATABASE_URL
  console.log('[DB] Connecting to:', dbUrl.substring(0, 50) + '...')

  const pool = new Pool({ connectionString: dbUrl })
  _db = drizzle(pool, { schema })
  return _db
}

export function getDb(): ReturnType<typeof drizzle> {
  return initDb()
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const realDb = initDb() as any
    return realDb[prop as any]
  },
})

// Export schema for convenience
export * from './schema';

