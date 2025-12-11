const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function applySafeMigration() {
  try {
    console.log('Connecting to database...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();

    const db = drizzle(client);

    console.log('Applying migration for ape_sponsor_codes table...');

    // Check if table exists
    const tableCheck = await client.query(`
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'ape_sponsor_codes';
    `);

    if (tableCheck.rowCount === 0) {
      // Only create the enum if the table doesn't exist (meaning this is a fresh migration)
      try {
        await client.query(`
          CREATE TYPE "public"."SponsorCodeStatus" AS ENUM('ACTIVE', 'INACTIVE', 'EXPIRED');
        `);
      } catch (enumError) {
        // If enum already exists, that's fine - we can proceed with table creation
        if (!enumError.message.includes('already exists')) {
          throw enumError;
        }
      }

      await client.query(`
        CREATE TABLE "ape_sponsor_codes" (
          "id" text PRIMARY KEY NOT NULL,
          "code" text NOT NULL,
          "description" text,
          "createdBy" text NOT NULL,
          "status" "SponsorCodeStatus" DEFAULT 'ACTIVE' NOT NULL,
          "usageCount" integer DEFAULT 0 NOT NULL,
          "maxUsage" integer,
          "expiresAt" timestamp,
          "createdAt" timestamp DEFAULT now() NOT NULL,
          "updatedAt" timestamp DEFAULT now() NOT NULL,
          CONSTRAINT "ape_sponsor_codes_code_unique" UNIQUE("code")
        );
      `);
    }

    await client.query(`
      ALTER TABLE "ape_sponsor_codes" ADD CONSTRAINT "ape_sponsor_codes_createdBy_admin_users_id_fk"
      FOREIGN KEY ("createdBy") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;
    `);

    console.log('✅ Migration applied successfully!');
    console.log('📊 New table "ape_sponsor_codes" has been added to your database');
    console.log('🔑 New enum "SponsorCodeStatus" has been created');

    await client.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applySafeMigration();