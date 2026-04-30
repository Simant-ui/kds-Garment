const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ywfyvunybzwjmwcposwi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Znl2dW55Ynp3am13Y3Bvc3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTE3MTksImV4cCI6MjA5MjQ4NzcxOX0.URFlWjBHIlSEf0YA-0jxnlYsY8SxILc88TUMfDr70W4');

async function check() {
  // Try to get more info by inserting a partial object and seeing the error
  const { data, error } = await supabase.from('order_items').insert({}).select();
  console.log('Error Message:', error?.message);
}
check();
