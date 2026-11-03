create table public.iban_additional_accounts (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (length(slug) between 1 and 120),
  recipient_name text not null check (length(btrim(recipient_name)) between 1 and 120),
  iban text not null check (iban ~ '^TR[0-9]{24}$'),
  bank_name text not null check (length(btrim(bank_name)) between 1 and 120),
  bank_id text,
  created_at timestamptz not null default now(),
  updated_by uuid not null default auth.uid() references auth.users(id)
);

create index iban_additional_accounts_slug_created_idx
  on public.iban_additional_accounts (slug, created_at, id);

alter table public.iban_additional_accounts enable row level security;
revoke all on public.iban_additional_accounts from anon, authenticated;
grant select on public.iban_additional_accounts to anon, authenticated;
grant insert, update, delete on public.iban_additional_accounts to authenticated;

create policy "iban_additional_accounts_public_read"
on public.iban_additional_accounts for select to anon, authenticated
using (true);

create policy "iban_additional_accounts_admin_insert"
on public.iban_additional_accounts for insert to authenticated
with check ((select public.can_manage_ibans()) and updated_by = (select auth.uid()));

create policy "iban_additional_accounts_admin_update"
on public.iban_additional_accounts for update to authenticated
using ((select public.can_manage_ibans()))
with check ((select public.can_manage_ibans()) and updated_by = (select auth.uid()));

create policy "iban_additional_accounts_admin_delete"
on public.iban_additional_accounts for delete to authenticated
using ((select public.can_manage_ibans()));
