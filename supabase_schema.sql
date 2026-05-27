-- ============================================================
--  Tesla Invest — Supabase Schema
--  Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- USERS
create table if not exists public.users (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  email    text not null unique,
  password text not null,
  joined   date not null default current_date
);

-- CARS
create table if not exists public.cars (
  id    bigint primary key,
  name  text not null,
  price numeric not null,
  image text,
  badge text,
  specs jsonb default '{}'::jsonb
);

-- INVESTMENTS
create table if not exists public.investments (
  id       bigserial primary key,
  user_id  uuid references public.users(id) on delete cascade,
  car_name text,
  amount   numeric not null,
  plan     text,
  date     date not null default current_date
);

-- ORDERS
create table if not exists public.orders (
  id       bigserial primary key,
  user_id  uuid references public.users(id) on delete cascade,
  car_name text,
  car_id   bigint,
  price    numeric,
  status   text not null default 'Pending',
  date     date not null default current_date
);

-- PAYMENTS
create table if not exists public.payments (
  id       bigserial primary key,
  user_id  uuid references public.users(id) on delete cascade,
  order_id bigint references public.orders(id) on delete set null,
  amount   numeric not null,
  method   text,
  status   text not null default 'Pending',
  date     date not null default current_date
);

-- Row Level Security
alter table public.users       enable row level security;
alter table public.cars        enable row level security;
alter table public.investments enable row level security;
alter table public.orders      enable row level security;
alter table public.payments    enable row level security;

create policy "users_all"       on public.users       for all using (true) with check (true);
create policy "cars_all"        on public.cars        for all using (true) with check (true);
create policy "investments_all" on public.investments for all using (true) with check (true);
create policy "orders_all"      on public.orders      for all using (true) with check (true);
create policy "payments_all"    on public.payments    for all using (true) with check (true);
