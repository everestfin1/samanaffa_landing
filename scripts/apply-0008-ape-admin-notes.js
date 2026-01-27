import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env.local') });

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL (expected in .env.local)');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    console.log('Applying migration: add adminNotes to ape_subscriptions...');

    await sql`ALTER TABLE "ape_subscriptions" ADD COLUMN IF NOT EXISTS "adminNotes" text`;
    console.log('✓ Column adminNotes ensured');

    // Optional index (safe)
    await sql`CREATE INDEX IF NOT EXISTS "ape_subscriptions_admin_notes_idx" ON "ape_subscriptions" ("adminNotes")`;
    console.log('✓ Index ape_subscriptions_admin_notes_idx ensured');

    const res = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'ape_subscriptions'
        AND column_name = 'adminNotes'
    `;

    if (res.length === 1) {
      console.log('✅ Verified: ape_subscriptions.adminNotes exists');
      process.exit(0);
    }

    console.error('❌ Verification failed: adminNotes column not found after migration');
    process.exit(1);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

main();
