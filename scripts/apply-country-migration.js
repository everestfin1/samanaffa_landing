const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function applyCountryMigration() {
  try {
    console.log('Connecting to database...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();

    console.log('Applying migration for APE subscription country...');

    // 1. Create the Country enum if it doesn't exist
    try {
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Country') THEN
            CREATE TYPE "public"."Country" AS ENUM('SENEGAL', 'TOGO');
          END IF;
        END $$;
      `);
      console.log('✅ Country enum verified/created');
    } catch (enumError) {
      console.error('❌ Error creating Country enum:', enumError.message);
      throw enumError;
    }

    // 2. Add the country column to ape_subscriptions
    try {
      await client.query(`
        ALTER TABLE "ape_subscriptions" 
        ADD COLUMN IF NOT EXISTS "country" "public"."Country" NOT NULL DEFAULT 'SENEGAL';
      `);
      console.log('✅ Column "country" added to "ape_subscriptions"');
    } catch (colError) {
      console.error('❌ Error adding country column:', colError.message);
      throw colError;
    }

    // 3. Add the country column to pee_leads (to match schema consistency)
    try {
      await client.query(`
        ALTER TABLE "pee_leads" 
        ADD COLUMN IF NOT EXISTS "country" "public"."Country" NOT NULL DEFAULT 'SENEGAL';
      `);
      console.log('✅ Column "country" added to "pee_leads"');
    } catch (colError) {
      console.log('ℹ️ pee_leads table might not exist yet, skipping...');
    }

    console.log('🚀 Migration applied successfully!');
    await client.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyCountryMigration();
