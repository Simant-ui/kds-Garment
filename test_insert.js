const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ywfyvunybzwjmwcposwi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Znl2dW55Ynp3am13Y3Bvc3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MTE3MTksImV4cCI6MjA5MjQ4NzcxOX0.URFlWjBHIlSEf0YA-0jxnlYsY8SxILc88TUMfDr70W4');

async function testInsert() {
  const orderId = 'f6d37794-f425-4acd-94c6-66c28de99c4e'; // One of the orders I found
  const productId = 'd140e793-6b73-4554-9457-37c2299a9b6c'; // I'll assume this exists or I'll fetch one
  
  const { data: p } = await supabase.from('products').select('id').limit(1).single();
  if (!p) {
    console.log('No products found to test with');
    return;
  }

  const { data, error } = await supabase
    .from('order_items')
    .insert({
      order_id: orderId,
      product_id: p.id,
      quantity: 1,
      price: 100
    });
  
  console.log('Insert Result:', data);
  console.log('Insert Error:', error);
}

testInsert();
