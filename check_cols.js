const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ywfyvunybzwjmwcposwi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Znl2dW55Ynp3am13Y3Bvc3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTE3MTksImV4cCI6MjA5MjQ4NzcxOX0.URFlWjBHIlSEf0YA-0jxnlYsY8SxILc88TUMfDr70W4');

async function check() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'order_items' });
  // If rpc doesn't exist, try a dummy select
  const { data: d2, error: e2 } = await supabase.from('order_items').select().limit(0);
  console.log('Error:', e2);
  // In some versions of supabase-js, error.message contains column names if you select * and it fails? No.
}
check();
