"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import type { ContentBrief, ContentStatus, GenerateContentResponse, GeneratedContent } from "@/lib/content-studio/types";

const initialBrief: ContentBrief = {
  sector: "Kafe / restoran",
  goal: "Google yorum artırma",
  tone: "Premium ve eğitici",
  product: "Biply Stand",
  slideCount: 8,
  notes: "",
};

const sectors = ["Kafe / restoran", "Kuaför / güzellik salonu", "Klinik", "Otel", "Spor salonu", "Butik mağaza"];
const goals = ["Google yorum artırma", "Müşteri güveni", "Google Maps görünürlüğü", "Sosyal medya takip", "WhatsApp aksiyonu"];
const tones = ["Premium ve eğitici", "Samimi", "Viral", "Sert ve direkt", "Minimal ve güven veren"];
const products = ["Biply Stand", "Biply Square", "Biply Round"];
const statuses: ContentStatus[] = ["draft", "approved", "posted"];

export function ContentStudioClient() {
  const [brief, setBrief] = useState<ContentBrief>(initialBrief);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const selectedContent = useMemo(
    () => contents.find((content) => content.id === selectedId) ?? contents[0] ?? null,
    [contents, selectedId],
  );

  useEffect(() => {
    void loadContents();
  }, []);

  async function loadContents() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/content");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Önceki içerikler alınamadı.");
      }

      const nextContents = Array.isArray(payload.contents) ? payload.contents : [];

      setContents(nextContents);
      setSelectedId((current) => current || nextContents[0]?.id || "");
      setNotice(payload.warning ?? "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Önceki içerikler alınamadı.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const payload = (await response.json()) as GenerateContentResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "İçerik üretilemedi.");
      }

      setContents((current) => [payload.content, ...current.filter((content) => content.id !== payload.content.id)]);
      setSelectedId(payload.content.id);
      setNotice(payload.warning ?? `İçerik ${payload.storage === "supabase" ? "Supabase" : "yerel dosya"} kaydına eklendi.`);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "İçerik üretilemedi.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function updateStatus(id: string, status: ContentStatus) {
    setError("");

    try {
      const response = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Status güncellenemedi.");
      }

      if (payload.content) {
        setContents((current) => current.map((content) => (content.id === id ? payload.content : content)));
      }

      setNotice(payload.warning ?? "Status güncellendi.");
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Status güncellenemedi.");
    }
  }

  async function copyContent(content: GeneratedContent) {
    await navigator.clipboard.writeText(formatContent(content));
    setNotice("İçerik panoya kopyalandı.");
  }

  async function copyCanvaText(content: GeneratedContent) {
    await navigator.clipboard.writeText(formatCanvaText(content));
    setNotice("Canva slide metni panoya kopyalandı.");
  }

  async function copyCanvaPrompt(content: GeneratedContent) {
    await navigator.clipboard.writeText(formatCanvaPrompt(content));
    setNotice("Canva Pro prompt'u panoya kopyalandı.");
  }

  function downloadJson(content: GeneratedContent) {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(content.title)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("JSON indirildi.");
  }

  function downloadCanvaText(content: GeneratedContent) {
    const blob = new Blob([formatCanvaText(content)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(content.title)}-canva.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Canva TXT indirildi.");
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[#f7f3ed]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" aria-label="Biply ana sayfa">
            <Logo compact image />
          </Link>
          <div className="hidden items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500 md:flex">
            <span>Growth Lab</span>
            <span className="h-1 w-1 rounded-full bg-zinc-300" />
            <span>Content Studio v1</span>
          </div>
          <Link href="/" className="inline-flex min-h-10 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-xs font-black text-zinc-950">
            Siteye dön
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:px-6 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-5">
          <div className="rounded-[2.2rem] bg-zinc-950 p-6 text-white shadow-2xl shadow-zinc-950/15">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-400">Biply Content Studio</p>
            <h1 className="mt-4 text-4xl font-black leading-[0.92] tracking-[-0.07em] md:text-6xl">
              Carousel fikrini dakikalar içinde üret.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-300 md:text-base md:leading-7">
              Sektör, amaç, ton ve ürünü seç. Hook’tan Canva brief’ine kadar Instagram/TikTok kaydırmalı post taslağı çıkar.
            </p>
          </div>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Sektör" value={brief.sector} options={sectors} onChange={(sector) => setBrief((current) => ({ ...current, sector }))} />
              <SelectField label="İçerik amacı" value={brief.goal} options={goals} onChange={(goal) => setBrief((current) => ({ ...current, goal }))} />
              <SelectField label="Ton" value={brief.tone} options={tones} onChange={(tone) => setBrief((current) => ({ ...current, tone }))} />
              <SelectField label="Ürün" value={brief.product} options={products} onChange={(product) => setBrief((current) => ({ ...current, product }))} />
              <SelectField
                label="Slide sayısı"
                value={String(brief.slideCount)}
                options={["7", "8", "10"]}
                onChange={(slideCount) => setBrief((current) => ({ ...current, slideCount: Number(slideCount) }))}
              />
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Ekstra not</span>
                <input
                  className="field-input"
                  value={brief.notes}
                  onChange={(event) => setBrief((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Örn: daha premium, klinik dili, İstanbul hedefli..."
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-5 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-zinc-950 px-7 text-sm font-black text-white shadow-xl shadow-zinc-950/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "İçerik üretiliyor..." : "İçerik üret"}
            </button>

            {(notice || error) && (
              <div className={`mt-4 rounded-2xl border p-4 text-sm font-bold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                {error || notice}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Önceki içerikler</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">Taslak havuzu</h2>
              </div>
              <button type="button" onClick={loadContents} className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-black">
                Yenile
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {isLoading && <p className="rounded-2xl bg-[#f7f3ed] p-4 text-sm font-bold text-zinc-600">Kayıtlar yükleniyor...</p>}
              {!isLoading && contents.length === 0 && <p className="rounded-2xl bg-[#f7f3ed] p-4 text-sm font-bold text-zinc-600">Henüz kayıt yok. İlk carousel’i üret, minik motor çalışsın.</p>}
              {contents.map((content) => (
                <button
                  key={content.id}
                  type="button"
                  onClick={() => setSelectedId(content.id)}
                  className={`rounded-[1.4rem] border p-4 text-left transition ${selectedContent?.id === content.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-[#f7f3ed] hover:border-zinc-400"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-black leading-5">{content.title}</h3>
                    <StatusBadge status={content.status} />
                  </div>
                  <p className={`mt-2 line-clamp-2 text-xs leading-5 ${selectedContent?.id === content.id ? "text-zinc-300" : "text-zinc-600"}`}>{content.hook}</p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[2.2rem] border border-white/80 bg-white/75 p-5 shadow-xl shadow-zinc-950/8 backdrop-blur md:p-6">
          {selectedContent ? (
            <ContentPreview
              content={selectedContent}
              onCanvaPromptCopy={copyCanvaPrompt}
              onCanvaTextCopy={copyCanvaText}
              onCanvaTextDownload={downloadCanvaText}
              onCopy={copyContent}
              onDownload={downloadJson}
              onStatusChange={updateStatus}
            />
          ) : (
            <div className="grid min-h-[36rem] place-items-center rounded-[1.8rem] border border-dashed border-zinc-300 bg-white/60 p-8 text-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Boş sahne</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.06em]">Bir içerik üretince burada görünecek.</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">Hook, slide metinleri, caption, hashtag ve Canva brief tek ekranda düzenlenebilir formatta çıkar.</p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function ContentPreview({
  content,
  onCanvaPromptCopy,
  onCanvaTextCopy,
  onCanvaTextDownload,
  onCopy,
  onDownload,
  onStatusChange,
}: {
  content: GeneratedContent;
  onCanvaPromptCopy: (content: GeneratedContent) => void;
  onCanvaTextCopy: (content: GeneratedContent) => void;
  onCanvaTextDownload: (content: GeneratedContent) => void;
  onCopy: (content: GeneratedContent) => void;
  onDownload: (content: GeneratedContent) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
}) {
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-5 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Üretilen carousel</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] md:text-4xl">{content.title}</h2>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-zinc-600">{content.hook}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onCanvaTextCopy(content)} className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-black text-white">
            Canva metni
          </button>
          <button type="button" onClick={() => onCanvaPromptCopy(content)} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-black">
            Canva prompt
          </button>
          <button type="button" onClick={() => onCanvaTextDownload(content)} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-black">
            TXT indir
          </button>
          <button type="button" onClick={() => onCopy(content)} className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-black text-white">
            Tam kopyala
          </button>
          <button type="button" onClick={() => onDownload(content)} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-black">
            JSON indir
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Status</span>
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(content.id, status)}
            className={`rounded-full px-3 py-1.5 text-xs font-black ${content.status === status ? "bg-zinc-950 text-white" : "border border-zinc-300 bg-white text-zinc-700"}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {content.slides.map((slide) => (
          <article key={`${content.id}-${slide.slide}`} className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-950 text-xs font-black text-white">{slide.slide}</span>
              <span className="rounded-full bg-[#f7f3ed] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-zinc-500">Slide</span>
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-[-0.05em]">{slide.headline}</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-zinc-700">{slide.body}</p>
            <p className="mt-4 rounded-2xl bg-[#f7f3ed] p-4 text-xs font-bold leading-5 text-zinc-600">
              <span className="text-zinc-950">Görsel yön:</span> {slide.visual_direction}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <InfoCard title="Caption" body={content.caption} />
        <InfoCard title="CTA" body={content.cta} />
        <InfoCard title="Hashtag" body={content.hashtags.join(" ")} />
        <InfoCard title="Canva brief" body={content.canva_brief} />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <select className="field-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-[1.5rem] border border-zinc-200 bg-[#f7f3ed] p-5">
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">{title}</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-zinc-700">{body}</p>
    </article>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className="shrink-0 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em]">
      {status}
    </span>
  );
}

function formatContent(content: GeneratedContent) {
  return [
    content.title,
    "",
    `Hook: ${content.hook}`,
    "",
    ...content.slides.flatMap((slide) => [
      `Slide ${slide.slide}: ${slide.headline}`,
      slide.body,
      `Görsel: ${slide.visual_direction}`,
      "",
    ]),
    `Caption: ${content.caption}`,
    "",
    `Hashtag: ${content.hashtags.join(" ")}`,
    "",
    `CTA: ${content.cta}`,
    "",
    `Canva brief: ${content.canva_brief}`,
  ].join("\n");
}

function formatCanvaText(content: GeneratedContent) {
  return [
    `CANVA CAROUSEL METNİ — ${content.title}`,
    "",
    "Tasarım notu:",
    content.canva_brief,
    "",
    ...content.slides.flatMap((slide) => [
      `SLIDE ${slide.slide}`,
      `Başlık: ${slide.headline}`,
      `Metin: ${slide.body}`,
      `Görsel yön: ${slide.visual_direction}`,
      "",
    ]),
    "CAPTION",
    content.caption,
    "",
    "HASHTAG",
    content.hashtags.join(" "),
    "",
    "CTA",
    content.cta,
  ].join("\n");
}

function formatCanvaPrompt(content: GeneratedContent) {
  const slidePrompts = content.slides
    .map(
      (slide) =>
        `Slide ${slide.slide}: Başlık "${slide.headline}". Destek metni "${slide.body}". Görsel yön: ${slide.visual_direction}`,
    )
    .join("\n");

  return [
    "Canva Pro / Magic Design için premium editorial Instagram carousel tasarımı oluştur.",
    "",
    "Format: 1080x1350 px, 4:5 oran, kaydırmalı Instagram/TikTok carousel.",
    "Marka: Biply. Tasarım reklam gibi görünmemeli; premium strateji notu, marka manifestosu veya modern danışmanlık deck'i gibi hissettirmeli.",
    "Stil: sakin, rafine, editorial, minimal, bol boşluklu, güven veren. Gürültülü sosyal medya şablonu, sticker, emoji, patlayan gradient ve abartılı stok görsel kullanma.",
    "Renkler: sıcak krem zemin (#f7f3ed), siyah tipografi, kırık beyaz kartlar, çok küçük amber veya nötr gri vurgu.",
    "Tipografi: güçlü ama zarif sans-serif başlıklar; başlıklar kısa, metinler küçük ve okunaklı. Her slide'da maksimum 1 ana fikir.",
    "Görsel dili: belgesel hissinde doğal ışıklı yakın planlar, ürün/masa/resepsiyon detayları, çok sade ikonlar. İnsanlar kameraya poz vermesin.",
    "Kompozisyon: ilk slide neredeyse sadece tipografi olabilir. Her slide'da büyük başlık + kısa açıklama + küçük görsel/ikon dengesi kur.",
    "Ürün sonlarda doğal çözüm olarak gelsin; ürün kataloğu veya satış afişi gibi durmasın.",
    "Kesinlikle kullanma: 'hemen al', 'kaçırma', büyük indirim dili, ünlem, emoji, parlak pazarlama rozetleri, aşırı renkli arka plan.",
    "",
    `Genel brief: ${content.canva_brief}`,
    "",
    slidePrompts,
    "",
    `Final CTA: ${content.cta}`,
  ].join("\n");
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}
