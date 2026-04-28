-- Update ORDERS Table for Guest Checkout
alter table public.orders alter column user_id drop not null;
alter table public.orders add column customer_name text;
alter table public.orders add column customer_email text;
