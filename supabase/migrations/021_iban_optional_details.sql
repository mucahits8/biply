alter table public.iban_profile_overrides
  alter column bank_name drop not null,
  drop constraint if exists iban_profile_overrides_bank_name_check;
alter table public.iban_profile_overrides
  add constraint iban_profile_overrides_bank_name_check
  check (bank_name is null or length(btrim(bank_name)) between 1 and 120);

alter table public.iban_additional_accounts
  alter column bank_name drop not null,
  drop constraint if exists iban_additional_accounts_bank_name_check;
alter table public.iban_additional_accounts
  add constraint iban_additional_accounts_bank_name_check
  check (bank_name is null or length(btrim(bank_name)) between 1 and 120);

alter table public.iban_additional_accounts
  add column description text
  check (description is null or length(description) <= 240);
