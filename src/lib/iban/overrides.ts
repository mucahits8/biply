import { getIbanProfileBySlug, ibanProfiles, type IbanProfile } from "@/data/iban-profiles";
import { formatIban } from "@/lib/iban/validation";
import { supabaseAnonKey, supabaseUrl } from "@/lib/sazende/supabase";

export type IbanOverrideRow = {
  slug: string;
  business_name: string;
  recipient_name: string;
  iban: string;
  bank_name: string | null;
  bank_id: IbanProfile["bankId"] | null;
  description: string | null;
  updated_at: string;
};

export type EditableIbanProfile = IbanProfile & {
  updatedAt?: string;
  additionalAccounts: AdditionalIbanAccount[];
};

export type AdditionalIbanAccount = {
  id: string;
  recipientName: string;
  iban: string;
  bankName?: string;
  bankId?: IbanProfile["bankId"];
  description?: string;
};

type AdditionalAccountRow = {
  id: string;
  slug: string;
  recipient_name: string;
  iban: string;
  bank_name: string | null;
  bank_id: IbanProfile["bankId"] | null;
  description: string | null;
};

const select = "slug,business_name,recipient_name,iban,bank_name,bank_id,description,updated_at";

function overrideUrl(slug?: string) {
  const url = new URL("/rest/v1/iban_profile_overrides", supabaseUrl);
  url.searchParams.set("select", select);
  if (slug) url.searchParams.set("slug", `eq.${slug}`);
  if (slug) url.searchParams.set("limit", "1");
  return url;
}

function mergeProfile(base: IbanProfile, accounts: AdditionalIbanAccount[], row?: IbanOverrideRow): EditableIbanProfile {
  if (!row) return { ...base, additionalAccounts: accounts };

  return {
    ...base,
    businessName: row.business_name,
    recipientName: row.recipient_name,
    iban: formatIban(row.iban),
    bankName: row.bank_name ?? undefined,
    bankId: row.bank_id ?? undefined,
    description: row.description ?? undefined,
    updatedAt: row.updated_at,
    additionalAccounts: accounts,
  };
}

async function fetchAdditionalAccounts(slug?: string): Promise<AdditionalAccountRow[]> {
  const url = new URL("/rest/v1/iban_additional_accounts", supabaseUrl);
  url.searchParams.set("select", "id,slug,recipient_name,iban,bank_name,bank_id,description");
  url.searchParams.set("order", "created_at.asc,id.asc");
  if (slug) url.searchParams.set("slug", `eq.${slug}`);
  const response = await fetch(url, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("IBAN bilgileri şu anda yüklenemiyor.");
  return (await response.json()) as AdditionalAccountRow[];
}

function mapAdditionalAccounts(rows: AdditionalAccountRow[]) {
  const bySlug = new Map<string, AdditionalIbanAccount[]>();
  for (const row of rows) {
    const accounts = bySlug.get(row.slug) ?? [];
    accounts.push({
      id: row.id,
      recipientName: row.recipient_name,
      iban: formatIban(row.iban),
      bankName: row.bank_name ?? undefined,
      bankId: row.bank_id ?? undefined,
      description: row.description ?? undefined,
    });
    bySlug.set(row.slug, accounts);
  }
  return bySlug;
}

async function fetchOverrides(slug?: string): Promise<IbanOverrideRow[]> {
  const response = await fetch(overrideUrl(slug), {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("IBAN bilgileri şu anda yüklenemiyor.");
  }

  return (await response.json()) as IbanOverrideRow[];
}

export async function getCurrentIbanProfileBySlug(slug: string) {
  const base = getIbanProfileBySlug(slug);
  if (!base) return undefined;
  const [overrides, additional] = await Promise.all([fetchOverrides(slug), fetchAdditionalAccounts(slug)]);
  return mergeProfile(base, mapAdditionalAccounts(additional).get(slug) ?? [], overrides[0]);
}

export async function getEditableIbanProfiles() {
  const [rows, additional] = await Promise.all([fetchOverrides(), fetchAdditionalAccounts()]);
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const accountsBySlug = mapAdditionalAccounts(additional);
  return ibanProfiles.map((base) => mergeProfile(base, accountsBySlug.get(base.slug) ?? [], bySlug.get(base.slug)));
}
