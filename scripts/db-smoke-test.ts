/**
 * Quick connectivity smoke test for db-srv via DATABASE_URL (.env.local).
 * Usage: bunx tsx scripts/db-smoke-test.ts
 */
import { config } from 'dotenv';
import pg from 'pg';
import { sql } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';

config({ path: '.env.local' });

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const v = await pool.query('SELECT version()');
    console.log('✓ Connected:', String(v.rows[0].version).slice(0, 60));

    const counts = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS users,
        (SELECT COUNT(*)::int FROM registration_sessions) AS registration_sessions,
        (SELECT COUNT(*)::int FROM otp_codes) AS otp_codes
    `);
    console.log('✓ Table counts:', counts.rows[0]);

    const schemas = await pool.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('public','drizzle') ORDER BY 1`,
    );
    console.log('✓ Schemas:', schemas.rows.map((r) => r.schema_name).join(', '));

    try {
      const mig = await pool.query(
        'SELECT COUNT(*)::int AS n FROM drizzle.__drizzle_migrations',
      );
      console.log('✓ Applied migrations:', mig.rows[0].n);
    } catch (e) {
      console.log('○ drizzle migrations table:', (e as Error).message);
    }

    const appCount = await db.select({ n: sql<number>`count(*)::int` }).from(users);
    console.log('✓ App driver (drizzle/pg) users count:', appCount[0]?.n);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('✗ Smoke test failed:', err);
  process.exit(1);
});
