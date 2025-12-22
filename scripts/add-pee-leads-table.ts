import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addPeeLeadsTable() {
  const client = await pool.connect();
  
  try {
    console.log('Adding pee_leads table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS "pee_leads" (
        "id" text PRIMARY KEY NOT NULL,
        "civilite" text NOT NULL,
        "prenom" text NOT NULL,
        "nom" text NOT NULL,
        "categorie" text NOT NULL,
        "pays" text NOT NULL,
        "ville" text NOT NULL,
        "telephone" text NOT NULL,
        "email" text,
        "status" text NOT NULL DEFAULT 'NEW',
        "adminNotes" text,
        "createdAt" timestamp DEFAULT now() NOT NULL,
        "updatedAt" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    console.log('✓ pee_leads table created');
    
    console.log('Creating indexes...');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS "pee_leads_status_idx" ON "pee_leads" ("status");
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS "pee_leads_created_at_idx" ON "pee_leads" ("createdAt");
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS "pee_leads_telephone_idx" ON "pee_leads" ("telephone");
    `);
    
    console.log('✓ Indexes created');
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addPeeLeadsTable().catch(console.error);
