const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nzkcktausubexsfoqloo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56a2NrdGF1c3ViZXhzZm9xbG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkxMjg3MiwiZXhwIjoyMDc1NDg4ODcyfQ.13wWTmq6KMLLK-MfsMBOSKJ0AhdASdZ9Rwq3KGInc6k';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { sql_query: sql });

    if (error) {
      console.error('SQL Error:', error);
      return false;
    }

    console.log('✅ SQL executed successfully');
    return true;
  } catch (err) {
    console.error('Execution error:', err);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting migration process...\n');

  // Read migration file
  console.log('📖 Reading migration file...');
  const migrationSQL = fs.readFileSync('./supabase/migrations/20250101000005_create_time_slots.sql', 'utf8');

  console.log('📝 Applying migration...');
  const migrationSuccess = await executeSQL(migrationSQL);

  if (!migrationSuccess) {
    console.error('❌ Migration failed. Stopping...');
    process.exit(1);
  }

  // Read seed file
  console.log('\n📖 Reading seed file...');
  const seedSQL = fs.readFileSync('./supabase/seed_time_slots.sql', 'utf8');

  console.log('🌱 Seeding data...');
  const seedSuccess = await executeSQL(seedSQL);

  if (!seedSuccess) {
    console.error('❌ Seeding failed.');
    process.exit(1);
  }

  console.log('\n✅ Migration and seeding completed successfully!');
}

main().catch(console.error);
