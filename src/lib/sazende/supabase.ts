export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://dbzpgkpcbiveuahujgbz.supabase.co";

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_24WLX5x_0ZWAeyvZDzTCEA_OtpUKirb";

export function supabaseHeaders(accessToken?: string) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken ?? supabaseAnonKey}`,
    "Content-Type": "application/json",
  };
}

export function supabaseRestUrl(path: string, params?: URLSearchParams) {
  const url = new URL(`/rest/v1/${path}`, supabaseUrl);
  if (params) {
    params.forEach((value, key) => url.searchParams.set(key, value));
  }
  return url.toString();
}

export async function supabaseFetch<T>(
  path: string,
  params?: URLSearchParams,
  accessToken?: string,
  init?: RequestInit,
) {
  const response = await fetch(supabaseRestUrl(path, params), {
    ...init,
    headers: {
      ...supabaseHeaders(accessToken),
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const text = await response.text();
  if (!text) {
    return null as T;
  }

  return JSON.parse(text) as T;
}
