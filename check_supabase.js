const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nmcegwmrzewwgqxgbspi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY2Vnd21yemV3d2dxeGdic3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTYzODksImV4cCI6MjA4OTQzMjM4OX0.bzDMYBoPreHGcQY8_1yIT6bERHqkJy5Uy8qoJnMNip0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  console.log('Checking quotations table...');
  
  // Try to fetch data
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .limit(5);
  
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  
  console.log('Data fetched:', data?.length || 0, 'records');
  
  if (data && data.length > 0) {
    console.log('Sample record:', JSON.stringify(data[0], null, 2));
  }
  
  // Try to get table info
  const { data: schema, error: schemaError } = await supabase
    .rpc('get_schema', { table_name: 'quotations' });
    
  if (schemaError) {
    console.log('Schema check failed (expected without rpc permission)');
  }
}

checkTable();
