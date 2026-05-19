/**
 * Compare Neon branches for users table (no secrets printed).
 * Usage: bunx tsx scripts/check-db-branches.ts
 */
import { config } from 'dotenv';
import pg from 'pg';

async function check(label: string, url: string | undefined) {
  if (!url) {
    console.log(`${label}: (no URL)`);
    return;
  }
  const clean = url.replace(/^['"]+|['"]+$/g, '');
  const parsed = new URL(clean);
  const pool = new pg.Pool({ connectionString: clean });
  try {
    const dbRes = await pool.query('SELECT current_database() AS db');
    const tableRes = await pool.query(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'users'
       ) AS has_users`,
    );
    let userCount: number | string = 'n/a';
    if (tableRes.rows[0]?.has_users) {
      const countRes = await pool.query('SELECT COUNT(*)::int AS n FROM users');
      userCount = countRes.rows[0].n;
    }
    console.log(`${label}:`, {
      host: parsed.hostname,
      database: parsed.pathname.replace(/^\//, ''),
      hasUsersTable: tableRes.rows[0].has_users,
      userCount,
    });
  } catch (e) {
    console.log(`${label}: ERROR`, e instanceof Error ? e.message : e);
  } finally {
    await pool.end();
  }
}

async function main() {
  config({ path: '.env.local', override: true });
  await check('active DATABASE_URL (.env.local)', process.env.DATABASE_URL);

  // Other branches documented in .env.local comments (hosts only — credentials from active URL)
  const active = process.env.DATABASE_URL?.replace(/^['"]+|['"]+$/g, '');
  if (active) {
    const u = new URL(active);
    const branches = [
      { label: 'commented preview (weathered-butterfly)', host: 'ep-weathered-butterfly-abt0k2l5-pooler.eu-west-2.aws.neon.tech' },
      { label: 'commented staging (cold-pine)', host: 'ep-cold-pine-abfbfoco-pooler.eu-west-2.aws.neon.tech' },
      { label: 'commented prod-2 (small-bird)', host: 'ep-small-bird-ab1akd9e-pooler.eu-west-2.aws.neon.tech' },
    ];
    for (const b of branches) {
      u.hostname = b.host;
      await check(b.label, u.toString());
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
