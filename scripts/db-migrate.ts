/**
 * Apply pending Drizzle SQL migrations (journal-tracked).
 * Usage: npx tsx scripts/db-migrate.ts
 */
import { config } from 'dotenv';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

config({ path: '.env.local' });
config({ path: '.env' });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: url });
  const db = drizzle(pool);

  console.log('Applying migrations from ./drizzle …');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied successfully.');
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
