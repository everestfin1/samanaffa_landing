import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function applyMigration() {
  try {
    console.log('Applying migration to add failedAttempts and lockedUntil columns...');
    
    await sql`ALTER TABLE "users" ADD COLUMN "failedAttempts" integer DEFAULT 0 NOT NULL`;
    console.log('✓ Added failedAttempts column');
    
    await sql`ALTER TABLE "users" ADD COLUMN "lockedUntil" timestamp(3)`;
    console.log('✓ Added lockedUntil column');
    
    console.log('Migration applied successfully!');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Columns already exist, skipping migration');
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

applyMigration();
