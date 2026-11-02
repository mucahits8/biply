create table if not exists public.iban_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.iban_profile_overrides (
  slug text primary key,
  business_name text not null check (length(btrim(business_name)) between 1 and 120),
  recipient_name text not null check (length(btrim(recipient_name)) between 1 and 120),
  iban text not null check (iban ~ '^TR[0-9]{24}$'),
  bank_name text not null check (length(btrim(bank_name)) between 1 and 120),
  bank_id text,
  description text check (description is null or length(description) <= 240),
  updated_at timestamptz not null default now(),
  updated_by uuid not null default auth.uid() references auth.users(id)
);

create or replace function public.can_manage_ibans()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.iban_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.can_manage_ibans() from public;
grant execute on function public.can_manage_ibans() to authenticated;

alter table public.iban_admins enable row level security;
alter table public.iban_profile_overrides enable row level security;

revoke all on public.iban_admins from anon, authenticated;
revoke all on public.iban_profile_overrides from anon, authenticated;
grant select on public.iban_admins to authenticated;
grant select on public.iban_profile_overrides to anon, authenticated;
grant insert, update on public.iban_profile_overrides to authenticated;

create policy "iban_admins_read_self"
on public.iban_admins for select to authenticated
using (user_id = (select auth.uid()));

create policy "iban_overrides_public_read"
on public.iban_profile_overrides for select to anon, authenticated
using (true);

create policy "iban_overrides_admin_insert"
on public.iban_profile_overrides for insert to authenticated
with check ((select public.can_manage_ibans()) and updated_by = (select auth.uid()));

create policy "iban_overrides_admin_update"
on public.iban_profile_overrides for update to authenticated
using ((select public.can_manage_ibans()))
with check ((select public.can_manage_ibans()) and updated_by = (select auth.uid()));

-- Grant an existing Supabase Auth user access after applying this migration:
-- insert into public.iban_admins (user_id)
-- select id from auth.users where lower(email) = lower('owner@example.com')
-- on conflict (user_id) do nothing;
