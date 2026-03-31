// Script untuk apply RLS policy via Supabase Management API
// Note: Ini memerlukan service role key atau management API token

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nmcegwmrzewwgqxgbspi.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Butuh service role key

if (!serviceRoleKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable required');
  console.log('\nUntuk apply policy, ada 2 cara:');
  console.log('1. Jalankan SQL di Supabase Dashboard (SQL Editor)');
  console.log('2. Set SUPABASE_SERVICE_ROLE_KEY dan jalankan script ini');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyPolicy() {
  console.log('Applying RLS policy...\n');
  
  const sql = `
    -- Enable RLS
    ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Allow select" ON quotations;
    DROP POLICY IF EXISTS "Allow insert" ON quotations;
    DROP POLICY IF EXISTS "Allow update" ON quotations;
    DROP POLICY IF EXISTS "Allow delete" ON quotations;
    
    -- Create new policies
    CREATE POLICY "Allow select"
    ON quotations FOR SELECT TO anon, authenticated USING (true);
    
    CREATE POLICY "Allow insert"
    ON quotations FOR INSERT TO anon, authenticated WITH CHECK (true);
    
    CREATE POLICY "Allow update"
    ON quotations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
    
    CREATE POLICY "Allow delete"
    ON quotations FOR DELETE TO anon, authenticated USING (true);
  `;
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error applying policy:', error);
      return;
    }
    
    console.log('✅ Policy applied successfully!');
    console.log('Result:', data);
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

applyPolicy();
