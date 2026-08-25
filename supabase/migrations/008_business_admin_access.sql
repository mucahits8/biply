create table if not exists public.business_admins (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

create or replace function public.can_manage_business(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_admins admin
    where admin.business_id = target_business_id
      and admin.user_id = auth.uid()
  );
$$;

revoke all on function public.can_manage_business(uuid) from public;
grant execute on function public.can_manage_business(uuid) to authenticated;

alter table public.business_admins enable row level security;
alter table public.businesses enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "business_admins_select_own" on public.business_admins;
create policy "business_admins_select_own"
on public.business_admins
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "businesses_public_select" on public.businesses;
create policy "businesses_public_select"
on public.businesses
for select
to anon, authenticated
using (true);

drop policy if exists "businesses_admin_update" on public.businesses;
create policy "businesses_admin_update"
on public.businesses
for update
to authenticated
using (public.can_manage_business(id))
with check (public.can_manage_business(id));

drop policy if exists "menu_categories_public_select" on public.menu_categories;
create policy "menu_categories_public_select"
on public.menu_categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "menu_categories_admin_insert" on public.menu_categories;
create policy "menu_categories_admin_insert"
on public.menu_categories
for insert
to authenticated
with check (public.can_manage_business(business_id));

drop policy if exists "menu_categories_admin_update" on public.menu_categories;
create policy "menu_categories_admin_update"
on public.menu_categories
for update
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "menu_items_public_select" on public.menu_items;
create policy "menu_items_public_select"
on public.menu_items
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "menu_items_admin_insert" on public.menu_items;
create policy "menu_items_admin_insert"
on public.menu_items
for insert
to authenticated
with check (public.can_manage_business(business_id));

drop policy if exists "menu_items_admin_update" on public.menu_items;
create policy "menu_items_admin_update"
on public.menu_items
for update
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

-- Auth user assignments are intentionally not hard-coded here.
-- After creating each Auth user, run for example:
--
-- insert into public.business_admins (business_id, user_id, role)
-- select businesses.id, users.id, 'owner'
-- from public.businesses businesses
-- join auth.users users on users.email = 'hamarat@example.com'
-- where businesses.slug = 'hamarat'
-- on conflict (business_id, user_id) do update
-- set role = excluded.role;
