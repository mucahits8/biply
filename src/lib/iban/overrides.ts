import { getIbanProfileBySlug, ibanProfiles, type IbanProfile } from "@/data/iban-profiles";
import { formatIban } from "@/lib/iban/validation";
import { supabaseAnonKey, supabaseUrl } from "@/lib/sazende/supabase";

export type IbanOverrideRow = {
  slug: string;
  business_name: string;
  recipient_name: string;
  iban: string;
  bank_name: string;
  bank_id: IbanProfile["bankId"] | null;
  description: string | null;
  updated_at: string;
};

export type EditableIbanProfile = IbanProfile & {
  updatedAt?: string;
};

const select = "slug,business_name,recipient_name,iban,bank_name,bank_id,description,updated_at";

function overrideUrl(slug?: string) {
  const url = new URL("/rest/v1/iban_profile_overrides", supabaseUrl);
  url.searchParams.set("select", select);
  if (slug) url.searchParams.set("slug", `eq.${slug}`);
  if (slug) url.searchParams.set("limit", "1");
  return url;
}

function mergeProfile(base: IbanProfile, row?: IbanOverrideRow): EditableIbanProfile {
  if (!row) return base;

  return {
    ...base,
    businessName: row.business_name,
    recipientName: row.recipient_name,
    iban: formatIban(row.iban),
    bankName: row.bank_name,
    bankId: row.bank_id ?? undefined,
    description: row.description ?? undefined,
    updatedAt: row.updated_at,
  };
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
  const [row] = await fetchOverrides(slug);
  return mergeProfile(base, row);
}

export async function getEditableIbanProfiles() {
  const rows = await fetchOverrides();
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return ibanProfiles.map((base) => mergeProfile(base, bySlug.get(base.slug)));
}
