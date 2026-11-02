import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "@/lib/sazende/supabase";

export const IBAN_ADMIN_COOKIE = "biply_iban_admin_access";

export async function authorizeIbanAdmin(accessToken: string) {
  const url = new URL("/rest/v1/iban_admins", supabaseUrl);
  url.searchParams.set("select", "user_id");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ user_id: string }>;
  return rows[0]?.user_id ?? null;
}

export async function getIbanAdminSession() {
  const token = (await cookies()).get(IBAN_ADMIN_COOKIE)?.value;
  if (!token) return null;
  const userId = await authorizeIbanAdmin(token);
  return userId ? { token, userId } : null;
}
