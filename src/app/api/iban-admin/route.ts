import { NextRequest, NextResponse } from "next/server";
import { getIbanProfileBySlug } from "@/data/iban-profiles";
import { bankBrands } from "@/data/bank-brands";
import { authorizeIbanAdmin, getIbanAdminSession, IBAN_ADMIN_COOKIE } from "@/lib/iban/admin-auth";
import { getEditableIbanProfiles } from "@/lib/iban/overrides";
import { isValidTurkishIban, normalizeIban } from "@/lib/iban/validation";
import { supabaseAnonKey, supabaseUrl } from "@/lib/sazende/supabase";

export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function readJson(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return null;
  const text = await request.text();
  if (text.length > 4096) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export async function GET() {
  try {
    const session = await getIbanAdminSession();
    if (!session) return json({ error: "Oturum açmanız gerekiyor." }, 401);
    return json({ profiles: await getEditableIbanProfiles() });
  } catch {
    return json({ error: "IBAN kayıtları yüklenemedi." }, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return json({ error: "Geçersiz istek kaynağı." }, 403);
  const payload = await readJson(request);
  if (!isRecord(payload)) return json({ error: "Geçersiz giriş bilgileri." }, 400);

  if (payload.action === "link") {
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return json({ error: "Geçerli bir e-posta adresi girin." }, 400);
    }
    try {
      const otpUrl = new URL("/auth/v1/otp", supabaseUrl);
      otpUrl.searchParams.set("redirect_to", new URL("/iban-yonetim", request.url).toString());
      const response = await fetch(otpUrl, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          create_user: false,
        }),
        cache: "no-store",
      });
      if (!response.ok) return json({ error: "Bağlantı gönderilemedi. Biraz sonra tekrar deneyin." }, 429);
      return json({ ok: true });
    } catch {
      return json({ error: "Bağlantı gönderilemedi. Biraz sonra tekrar deneyin." }, 503);
    }
  }

  if (payload.action === "token") {
    const token = typeof payload.accessToken === "string" ? payload.accessToken : "";
    if (!token || token.length > 4096) return json({ error: "Giriş bağlantısı geçersiz." }, 400);
    try {
      if (!(await authorizeIbanAdmin(token))) return json({ error: "Bu hesap için IBAN yönetim yetkisi yok." }, 403);
      const response = json({ ok: true });
      response.cookies.set(IBAN_ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/iban-admin",
        maxAge: 3600,
      });
      return response;
    } catch {
      return json({ error: "Giriş bağlantısı doğrulanamadı." }, 503);
    }
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  if (!email || !password || email.length > 254 || password.length > 1024) {
    return json({ error: "E-posta ve şifre gerekli." }, 400);
  }

  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: supabaseAnonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    if (!authResponse.ok) return json({ error: "Giriş bilgileri geçersiz veya yetkiniz yok." }, 401);

    const session = (await authResponse.json()) as { access_token?: string; expires_in?: number };
    if (!session.access_token || !(await authorizeIbanAdmin(session.access_token))) {
      return json({ error: "Giriş bilgileri geçersiz veya yetkiniz yok." }, 403);
    }

    const response = json({ ok: true });
    response.cookies.set(IBAN_ADMIN_COOKIE, session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/iban-admin",
      maxAge: Math.min(Math.max(session.expires_in ?? 3600, 60), 3600),
    });
    return response;
  } catch {
    return json({ error: "Giriş şu anda yapılamıyor." }, 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) return json({ error: "Geçersiz istek kaynağı." }, 403);

  try {
    const session = await getIbanAdminSession();
    if (!session) return json({ error: "Oturumunuz sona erdi. Tekrar giriş yapın." }, 401);

    const payload = await readJson(request);
    if (!isRecord(payload)) return json({ error: "Geçersiz kayıt." }, 400);

    const slug = typeof payload.slug === "string" ? payload.slug : "";
    const businessName = typeof payload.businessName === "string" ? payload.businessName.trim() : "";
    const recipientName = typeof payload.recipientName === "string" ? payload.recipientName.trim() : "";
    const iban = typeof payload.iban === "string" ? normalizeIban(payload.iban) : "";
    const bankName = typeof payload.bankName === "string" ? payload.bankName.trim() : "";
    const description = typeof payload.description === "string" ? payload.description.trim() : "";

    if (!getIbanProfileBySlug(slug)) return json({ error: "IBAN sayfası bulunamadı." }, 404);
    if (!businessName || businessName.length > 120 || !recipientName || recipientName.length > 120) {
      return json({ error: "İşletme ve hesap sahibi adlarını kontrol edin." }, 400);
    }
    if (!isValidTurkishIban(iban)) {
      return json({ error: "Geçerli bir Türkiye IBAN'ı girin." }, 400);
    }
    if (!bankName || bankName.length > 120 || description.length > 240) {
      return json({ error: "Banka adı veya açıklama uzunluğunu kontrol edin." }, 400);
    }

    const brand = Object.values(bankBrands).find(
      (item) => item.name.toLocaleLowerCase("tr") === bankName.toLocaleLowerCase("tr"),
    );
    const url = new URL("/rest/v1/iban_profile_overrides", supabaseUrl);
    url.searchParams.set("on_conflict", "slug");
    const saveResponse = await fetch(url, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        slug,
        business_name: businessName,
        recipient_name: recipientName,
        iban,
        bank_name: bankName,
        bank_id: brand?.id ?? null,
        description: description || null,
        updated_at: new Date().toISOString(),
        updated_by: session.userId,
      }),
      cache: "no-store",
    });

    if (!saveResponse.ok) return json({ error: "Kayıt kaydedilemedi. Tekrar deneyin." }, 503);
    const savedRows = (await saveResponse.json()) as Array<{ slug?: string; iban?: string }>;
    if (savedRows[0]?.slug !== slug || savedRows[0]?.iban !== iban) {
      return json({ error: "Kayıt doğrulanamadı. Canlı sayfayı kontrol edin." }, 503);
    }
    return json({ ok: true });
  } catch {
    return json({ error: "Kayıt kaydedilemedi. Tekrar deneyin." }, 503);
  }
}

export async function DELETE(request: NextRequest) {
  if (!hasSameOrigin(request)) return json({ error: "Geçersiz istek kaynağı." }, 403);
  const response = json({ ok: true });
  response.cookies.set(IBAN_ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/iban-admin",
    maxAge: 0,
  });
  return response;
}
