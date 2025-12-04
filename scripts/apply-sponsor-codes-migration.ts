import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL!);

async function applyMigration() {
  try {
    console.log('Applying migration to add APE sponsor codes table...');
    
    // Create enum if not exists
    console.log('Creating SponsorCodeStatus enum...');
    await sql`
      DO $$ BEGIN
        CREATE TYPE "SponsorCodeStatus" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✓ SponsorCodeStatus enum ready');
    
    // Create table if not exists
    console.log('Creating ape_sponsor_codes table...');
    await sql`
      CREATE TABLE IF NOT EXISTS "ape_sponsor_codes" (
        "id" text PRIMARY KEY NOT NULL,
        "code" text NOT NULL UNIQUE,
        "description" text,
        "createdBy" text NOT NULL REFERENCES "admin_users"("id") ON DELETE CASCADE,
        "status" "SponsorCodeStatus" NOT NULL DEFAULT 'ACTIVE',
        "usageCount" integer NOT NULL DEFAULT 0,
        "maxUsage" integer,
        "expiresAt" timestamp,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✓ ape_sponsor_codes table created');
    
    // Create indexes
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS "ape_sponsor_codes_code_idx" ON "ape_sponsor_codes" ("code")`;
    await sql`CREATE INDEX IF NOT EXISTS "ape_sponsor_codes_status_idx" ON "ape_sponsor_codes" ("status")`;
    console.log('✓ Indexes created');
    
    console.log('\n✅ Migration applied successfully!');
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('Table already exists, skipping migration');
    } else {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

applyMigration();
