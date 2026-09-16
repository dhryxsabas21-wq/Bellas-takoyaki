-- ===========================================================================
--  BELLA'S TAKOYAKI — Phase 2 database setup
--
--  Run this ONCE, in your Supabase project:
--    Supabase dashboard → SQL Editor → New query → paste all of this → Run
--
--  Safe to run again; every statement is idempotent.
-- ===========================================================================

create table if not exists public.products (
  id             text primary key,
  name           text not null,
  available      boolean not null default true,
  base_price     integer not null check (base_price > 0),
  variant_prices jsonb,
  updated_at     timestamptz not null default now()
);

-- Keep updated_at honest so you can see when a price last changed.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ===========================================================================
--  ROW LEVEL SECURITY
--
--  The public site reads this table with the anon key, which ships to every
--  visitor's browser. So: anyone may READ, only a signed-in staff account may
--  WRITE. Without this, a customer could edit your prices.
-- ===========================================================================

alter table public.products enable row level security;

drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "only signed-in staff can write" on public.products;
create policy "only signed-in staff can write"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

-- ===========================================================================
--  AFTER RUNNING THIS
--
--  1. Authentication → Users → "Add user" → create your staff account with an
--     email and password. Tick "Auto Confirm User" so you can sign in at once.
--
--  2. Authentication → Sign In / Providers → turn OFF "Allow new users to sign
--     up". Only you should ever have an account here.
--
--  3. Go to /admin on your site and press "Sync from menu file" to load all
--     your items into this table.
-- ===========================================================================
