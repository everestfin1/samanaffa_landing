/**
 * Apply AUTH-023 sessionVersion column only (safe — no db:push).
 *
 * Local dev (uses DATABASE_URL from .env.local):
 *   bunx tsx scripts/apply-session-version-column.ts
 *
 * Preview / production (paste URL from Vercel → Storage / Neon):
 *   DATABASE_URL="postgresql://..." bunx tsx scripts/apply-session-version-column.ts
 */
import { config } from 'dotenv';
import pg from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

config({ path: '.env.local' });

const SQL = readFileSync(
  join(process.cwd(), 'drizzle/0008_users_session_version.sql'),
  'utf8',
);

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const host = url.replace(/:[^:@]+@/, ':****@');
  console.log('Target database:', host);

  const pool = new pg.Pool({ connectionString: url });
  const client = await pool.connect();

  try {
    const before = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'sessionVersion'
    `);

    if (before.rows.length > 0) {
      console.log('Column "sessionVersion" already exists — nothing to do.');
      return;
    }

    const statements = SQL.split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean);

    for (const statement of statements) {
      console.log('Running:', statement.slice(0, 80).replace(/\s+/g, ' ') + '…');
      await client.query(statement);
    }

    console.log('Done. users.sessionVersion is ready.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
