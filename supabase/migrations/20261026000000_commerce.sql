-- Commerce only. No health columns. Browser roles get no policies, so the
-- anon key cannot read payments. The webhook connects as commerce_ingest.

create schema if not exists commerce;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'commerce_ingest') then
    create role commerce_ingest nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end
$$;

create table if not exists commerce.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_customer_id text,
  email text,
  band boolean not null default true,
  backup boolean not null default false,
  amount_total integer,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists commerce.subscriptions (
  stripe_subscription_id text primary key,
  stripe_customer_id text,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table commerce.orders enable row level security;
alter table commerce.subscriptions enable row level security;
alter table commerce.orders force row level security;
alter table commerce.subscriptions force row level security;

create policy commerce_ingest_orders on commerce.orders
  for all to commerce_ingest
  using (true)
  with check (true);

create policy commerce_ingest_subscriptions on commerce.subscriptions
  for all to commerce_ingest
  using (true)
  with check (true);

comment on table commerce.orders is
  'Browser roles have no policy and cannot read payments.';

revoke all on schema commerce from public;
revoke all on schema commerce from anon;
revoke all on schema commerce from authenticated;
grant usage on schema commerce to commerce_ingest;
grant select, insert, update on commerce.orders to commerce_ingest;
grant select, insert, update on commerce.subscriptions to commerce_ingest;
