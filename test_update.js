const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nmcegwmrzewwgqxgbspi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tY2Vnd21yemV3d2dxeGdic3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTYzODksImV4cCI6MjA4OTQzMjM4OX0.bzDMYBoPreHGcQY8_1yIT6bERHqkJy5Uy8qoJnMNip0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  console.log('Testing UPDATE operation...\n');
  
  // First get a record
  const { data: records, error: fetchError } = await supabase
    .from('quotations')
    .select('quotation_id, company_name')
    .limit(1);
  
  if (fetchError || !records || records.length === 0) {
    console.error('Failed to fetch record:', fetchError);
    return;
  }
  
  const testId = records[0].quotation_id;
  console.log('Testing update on record:', testId);
  console.log('Current company_name:', records[0].company_name);
  
  // Try to update
  const { data, error } = await supabase
    .from('quotations')
    .update({ 
      company_name: records[0].company_name + ' (TEST)',
      updated_at: new Date().toISOString()
    })
    .eq('quotation_id', testId)
    .select();
  
  if (error) {
    console.error('\n❌ UPDATE FAILED:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
  } else {
    console.log('\n✅ UPDATE SUCCESS!');
    console.log('Updated data:', data);
    
    // Revert back
    await supabase
      .from('quotations')
      .update({ 
        company_name: records[0].company_name,
        updated_at: new Date().toISOString()
      })
      .eq('quotation_id', testId);
    console.log('Reverted test changes.');
  }
}

testUpdate();
