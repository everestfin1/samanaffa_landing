const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function verifyMigration() {
  try {
    console.log('🔍 Verifying database schema synchronization...');

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();

    // Check if the ape_sponsor_codes table exists
    const tableCheck = await client.query(`
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'ape_sponsor_codes';
    `);

    // Check if the SponsorCodeStatus enum exists (case-insensitive)
    const enumCheck = await client.query(`
      SELECT 1 FROM pg_type WHERE typname ILIKE 'SponsorCodeStatus';
    `);

    // Check if the foreign key constraint exists
    const fkCheck = await client.query(`
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'ape_sponsor_codes_createdBy_admin_users_id_fk';
    `);

    console.log('✅ Verification Results:');
    console.log(`📋 ape_sponsor_codes table exists: ${tableCheck.rowCount > 0 ? '✅' : '❌'}`);
    console.log(`🔑 SponsorCodeStatus enum exists: ${enumCheck.rowCount > 0 ? '✅' : '❌'}`);
    console.log(`🔗 Foreign key constraint exists: ${fkCheck.rowCount > 0 ? '✅' : '❌'}`);

    if (tableCheck.rowCount > 0 && enumCheck.rowCount > 0 && fkCheck.rowCount > 0) {
      console.log('🎉 Database schema is fully synchronized!');
    } else {
      console.log('⚠️  Some schema elements are missing');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyMigration();