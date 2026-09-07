-- Run this once in Supabase Dashboard → SQL Editor → New query.
-- The Supabase Edge Function uses service_role access; public visitors never receive the key.

create table if not exists public.portfolio_store (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.portfolio_store enable row level security;

-- The Edge Function runs as service_role. Keep the table closed to browser roles.
grant usage on schema public to service_role;
grant all privileges on table public.portfolio_store to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
