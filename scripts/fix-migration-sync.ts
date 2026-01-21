import { sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function fixMigrationSync() {
  try {
    console.log('Checking migration history...');

    // Check if __drizzle_migrations table exists
    const tableCheckResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = '__drizzle_migrations'
      )
    `);

    const tableExists = (tableCheckResult.rows[0] as any)?.exists;

    if (!tableExists) {
      console.log('Creating __drizzle_migrations table...');
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
          id SERIAL PRIMARY KEY,
          hash text NOT NULL UNIQUE,
          created_at bigint
        )
      `);
    }

    // Check which migrations are already applied
    const appliedMigrations = await db.execute(sql`
      SELECT hash FROM "__drizzle_migrations" ORDER BY id
    `);

    const applied = (appliedMigrations.rows as any[]).map((r: any) => r.hash);
    console.log('Applied migrations:', applied);

    // Define migration hashes (from drizzle/meta/_journal.json)
    const migrations = [
      { idx: 0, hash: '0000_clever_hellion', tag: '0000_clever_hellion' },
      { idx: 1, hash: '0001_living_moira_mactaggert', tag: '0001_living_moira_mactaggert' },
      { idx: 2, hash: '0002_strange_rawhide_kid', tag: '0002_strange_rawhide_kid' },
      { idx: 3, hash: '0003_youthful_electro', tag: '0003_youthful_electro' },
    ];

    // Insert missing migrations (only if not already present)
    for (const mig of migrations) {
      if (!applied.includes(mig.hash)) {
        console.log(`Marking migration ${mig.hash} as applied...`);
        await db.execute(sql`
          INSERT INTO "__drizzle_migrations" (hash, created_at)
          VALUES (${mig.hash}, ${Date.now()})
          ON CONFLICT (hash) DO NOTHING
        `);
      }
    }

    console.log('✅ Migration history synced. Now run: bun run db:migrate');
  } catch (error) {
    console.error('❌ Error syncing migrations:', error);
    process.exit(1);
  }
}

fixMigrationSync();
