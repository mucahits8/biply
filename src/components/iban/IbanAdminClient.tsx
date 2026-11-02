"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { EditableIbanProfile } from "@/lib/iban/overrides";
import { formatIban, isValidTurkishIban } from "@/lib/iban/validation";

type FormValues = {
  businessName: string;
  recipientName: string;
  iban: string;
  bankName: string;
  description: string;
};

type View = "loading" | "login" | "ready";

function formFromProfile(profile: EditableIbanProfile): FormValues {
  return {
    businessName: profile.businessName,
    recipientName: profile.recipientName,
    iban: profile.iban,
    bankName: profile.bankName ?? "",
    description: profile.description ?? "",
  };
}

function sameForm(a: FormValues, b: FormValues) {
  return (
    a.businessName === b.businessName &&
    a.recipientName === b.recipientName &&
    a.iban === b.iban &&
    a.bankName === b.bankName &&
    a.description === b.description
  );
}

export function IbanAdminClient() {
  const [view, setView] = useState<View>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profiles, setProfiles] = useState<EditableIbanProfile[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("iban1");
  const [form, setForm] = useState<FormValues | null>(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selected = profiles.find((profile) => profile.slug === selectedSlug);
  const savedForm = selected ? formFromProfile(selected) : null;
  const changed = !!(form && savedForm && !sameForm(form, savedForm));
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr");
    if (!query) return profiles;
    return profiles.filter((profile) =>
      `${profile.slug} ${profile.businessName} ${profile.recipientName}`
        .toLocaleLowerCase("tr")
        .includes(query),
    );
  }, [profiles, search]);

  async function loadProfiles(slugToSelect?: string) {
    const response = await fetch("/api/iban-admin", { cache: "no-store" });
    if (response.status === 401) {
      setView("login");
      setProfiles([]);
      return;
    }
    const data = (await response.json()) as {
      error?: string;
      profiles?: EditableIbanProfile[];
    };
    if (!response.ok || !data.profiles) {
      throw new Error(data.error ?? "Kayıtlar yüklenemedi.");
    }
    setProfiles(data.profiles);
    const slug = slugToSelect ?? selectedSlug;
    const profile = data.profiles.find((item) => item.slug === slug) ?? data.profiles[0];
    if (profile) {
      setSelectedSlug(profile.slug);
      setForm(formFromProfile(profile));
    }
    setView("ready");
  }

  useEffect(() => {
    let active = true;
    fetch("/api/iban-admin", { cache: "no-store" })
      .then(async (response) => {
        if (!active) return;
        if (response.status === 401) {
          setView("login");
          return;
        }
        const data = (await response.json()) as {
          error?: string;
          profiles?: EditableIbanProfile[];
        };
        if (!response.ok || !data.profiles) {
          throw new Error(data.error ?? "Kayıtlar yüklenemedi.");
        }
        setProfiles(data.profiles);
        const first = data.profiles.find((item) => item.slug === "iban1") ?? data.profiles[0];
        if (first) {
          setSelectedSlug(first.slug);
          setForm(formFromProfile(first));
        }
        setView("ready");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Kayıtlar yüklenemedi.");
        setView("login");
      });
    return () => { active = false; };
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/iban-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Giriş yapılamadı.");
      setPassword("");
      await loadProfiles("iban1");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Giriş yapılamadı.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/iban-admin", { method: "DELETE" });
    setProfiles([]);
    setForm(null);
    setPassword("");
    setView("login");
    setNotice("");
    setError("");
  }

  function choose(profile: EditableIbanProfile) {
    if (changed && !window.confirm("Kaydedilmemiş değişiklikler silinsin mi?")) return;
    setSelectedSlug(profile.slug);
    setForm(formFromProfile(profile));
    setError("");
    setNotice("");
  }

  function update(field: keyof FormValues, value: string) {
    setForm((current) => current ? { ...current, [field]: value } : current);
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !form || !changed) return;
    if (!isValidTurkishIban(form.iban)) {
      setError("Geçerli bir Türkiye IBAN'ı girin.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/iban-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selected.slug, ...form }),
      });
      const data = (await response.json()) as { error?: string };
      if (response.status === 401) {
        setView("login");
        throw new Error("Oturumunuz sona erdi. Tekrar giriş yapın.");
      }
      if (!response.ok) throw new Error(data.error ?? "Kayıt kaydedilemedi.");
      await loadProfiles(selected.slug);
      setNotice("Kaydedildi. Canlı sayfayı açıp bilgileri kontrol edin.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Kayıt kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  if (view === "loading") {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] text-sm text-zinc-600">Yönetim paneli yükleniyor…</main>;
  }

  if (view === "login") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-4 py-10 text-zinc-950">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-950/5 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight text-blue-700">biply<span className="text-zinc-400">.</span></span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Yönetim</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">IBAN sayfalarınızı yönetin</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">Yetkili hesabınızla giriş yapın. Kaydettiğiniz bilgiler canlı sayfaya yansır.</p>
          <form onSubmit={signIn} className="mt-8 space-y-5">
            <Field label="E-posta" value={email} onChange={setEmail} type="email" autoComplete="username" required />
            <Field label="Şifre" value={password} onChange={setPassword} type="password" autoComplete="current-password" required />
            {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60">
              {busy ? "Giriş yapılıyor…" : "Giriş yap"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold tracking-tight text-blue-700">biply<span className="text-zinc-400">.</span></span>
            <span className="hidden h-6 w-px bg-zinc-200 sm:block" />
            <span className="text-sm font-semibold text-zinc-700">IBAN Yönetimi</span>
          </div>
          <button onClick={signOut} className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">Çıkış yap</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Hesap bilgileri</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Sayfalarınız</h1>
          <p className="mt-2 text-sm text-zinc-600">Bir sayfa seçin, bilgileri düzenleyin ve kaydedin. Kod değişikliği gerekmez.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:sticky lg:top-6">
            <div className="border-b border-zinc-100 p-4">
              <label htmlFor="iban-search" className="sr-only">Sayfalarda ara</label>
              <input id="iban-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Sayfa veya işletme ara" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
              <p className="mt-3 text-xs font-medium text-zinc-500">{filtered.length} sayfa</p>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-2">
              {filtered.map((profile) => (
                <button
                  key={profile.slug}
                  type="button"
                  onClick={() => choose(profile)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${profile.slug === selectedSlug ? "bg-blue-50 text-blue-900" : "hover:bg-zinc-50"}`}
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-blue-700">{profile.slug}</span>
                    <span className="mt-0.5 block truncate text-sm font-medium">{profile.businessName}</span>
                  </span>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${profile.businessName.startsWith("Örnek İşletme") ? "bg-zinc-300" : "bg-emerald-500"}`} />
                </button>
              ))}
              {filtered.length === 0 && <p className="p-4 text-sm text-zinc-500">Eşleşen sayfa yok.</p>}
            </div>
          </aside>

          {selected && form && (
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 px-5 py-6 sm:px-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{selected.slug}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">{selected.businessName}</h2>
                  {selected.updatedAt && <p className="mt-2 text-xs text-zinc-500">Son güncelleme: {new Date(selected.updatedAt).toLocaleString("tr-TR")}</p>}
                </div>
                <a href={`/iban/${selected.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Canlı sayfayı aç ↗</a>
              </div>
              <form onSubmit={save} className="px-5 py-6 sm:px-8 sm:py-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="İşletme adı" value={form.businessName} onChange={(value) => update("businessName", value)} maxLength={120} required />
                  <Field label="Hesap sahibi" value={form.recipientName} onChange={(value) => update("recipientName", value)} maxLength={120} required />
                  <div className="sm:col-span-2">
                    <Field label="IBAN" value={form.iban} onChange={(value) => update("iban", value)} onBlur={() => update("iban", formatIban(form.iban))} maxLength={40} autoComplete="off" spellCheck={false} required />
                    <p className="mt-1.5 text-xs text-zinc-500">Türkiye IBAN’ı 26 karakterdir; kaydetmeden önce kontrol edilir.</p>
                  </div>
                  <Field label="Banka" value={form.bankName} onChange={(value) => update("bankName", value)} maxLength={120} required />
                  <Field label="Açıklama (isteğe bağlı)" value={form.description} onChange={(value) => update("description", value)} maxLength={240} />
                </div>

                {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                {notice && <p role="status" className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-6">
                  <p className="text-xs text-zinc-500">{changed ? "Kaydedilmemiş değişiklikler var." : "Tüm değişiklikler kaydedildi."}</p>
                  <button type="submit" disabled={!changed || busy} className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-zinc-300">
                    {busy ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, onBlur, type = "text", ...props }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  required?: boolean;
  spellCheck?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-zinc-700">
      {label}
      <input
        {...props}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm font-normal text-zinc-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
