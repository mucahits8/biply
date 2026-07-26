import { promises as fs } from "node:fs";
import path from "node:path";
import type { ContentBrief, ContentStatus, GeneratedContent, GeneratedContentDraft } from "./types";

type StorageResult<T> = {
  data: T;
  storage: "supabase" | "local";
  warning?: string;
};

const localStoragePath = path.join(process.cwd(), ".content-studio", "generated-content.json");

export async function saveGeneratedContent(
  draft: GeneratedContentDraft,
  brief: ContentBrief,
): Promise<StorageResult<GeneratedContent>> {
  const now = new Date().toISOString();
  const content: GeneratedContent = {
    ...draft,
    id: crypto.randomUUID(),
    status: "draft",
    brief,
    created_at: now,
    updated_at: now,
  };

  const supabaseResult = await trySupabaseInsert(content);

  if (supabaseResult) {
    return supabaseResult;
  }

  const localItems = await readLocalItems();
  await writeLocalItems([content, ...localItems]);

  return {
    data: content,
    storage: "local",
    warning: getSupabaseConfig()
      ? "Supabase kaydı başarısız olduğu için içerik yerel JSON dosyasına kaydedildi."
      : "Supabase env değerleri bulunamadı; içerik yerel JSON dosyasına kaydedildi.",
  };
}

export async function listGeneratedContent(): Promise<StorageResult<GeneratedContent[]>> {
  const supabaseResult = await trySupabaseList();

  if (supabaseResult) {
    return supabaseResult;
  }

  return {
    data: await readLocalItems(),
    storage: "local",
    warning: getSupabaseConfig()
      ? "Supabase listesi okunamadığı için yerel kayıtlar gösteriliyor."
      : "Supabase env değerleri bulunamadı; yerel kayıtlar gösteriliyor.",
  };
}

export async function updateContentStatus(
  id: string,
  status: ContentStatus,
): Promise<StorageResult<GeneratedContent | null>> {
  const supabaseResult = await trySupabaseStatusUpdate(id, status);

  if (supabaseResult) {
    return supabaseResult;
  }

  const localItems = await readLocalItems();
  const updatedAt = new Date().toISOString();
  const nextItems = localItems.map((item) => (item.id === id ? { ...item, status, updated_at: updatedAt } : item));
  const updatedItem = nextItems.find((item) => item.id === id) ?? null;

  await writeLocalItems(nextItems);

  return {
    data: updatedItem,
    storage: "local",
    warning: getSupabaseConfig()
      ? "Supabase status güncellemesi başarısız olduğu için yerel kayıt güncellendi."
      : "Supabase env değerleri bulunamadı; yerel kayıt güncellendi.",
  };
}

async function trySupabaseInsert(content: GeneratedContent): Promise<StorageResult<GeneratedContent> | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${config.table}`, {
    method: "POST",
    headers: buildSupabaseHeaders(config.key, { Prefer: "return=representation" }),
    body: JSON.stringify(toSupabaseRow(content)),
  });

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as unknown[];
  const row = rows[0];

  return {
    data: fromSupabaseRow(row) ?? content,
    storage: "supabase",
  };
}

async function trySupabaseList(): Promise<StorageResult<GeneratedContent[]> | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${config.table}?select=*&order=created_at.desc&limit=30`, {
    headers: buildSupabaseHeaders(config.key),
  });

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as unknown[];

  return {
    data: rows.map(fromSupabaseRow).filter((item): item is GeneratedContent => Boolean(item)),
    storage: "supabase",
  };
}

async function trySupabaseStatusUpdate(
  id: string,
  status: ContentStatus,
): Promise<StorageResult<GeneratedContent | null> | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${config.table}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: buildSupabaseHeaders(config.key, { Prefer: "return=representation" }),
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as unknown[];

  return {
    data: fromSupabaseRow(rows[0]) ?? null,
    storage: "supabase",
  };
}

async function readLocalItems(): Promise<GeneratedContent[]> {
  try {
    const raw = await fs.readFile(localStoragePath, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter(isGeneratedContent) : [];
  } catch {
    return [];
  }
}

async function writeLocalItems(items: GeneratedContent[]) {
  await fs.mkdir(path.dirname(localStoragePath), { recursive: true });
  await fs.writeFile(localStoragePath, JSON.stringify(items, null, 2));
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  const table = process.env.SUPABASE_CONTENT_TABLE ?? "content_generations";

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
    table,
  };
}

function buildSupabaseHeaders(key: string, extraHeaders: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

function toSupabaseRow(content: GeneratedContent) {
  return {
    id: content.id,
    title: content.title,
    hook: content.hook,
    slides: content.slides,
    caption: content.caption,
    hashtags: content.hashtags,
    cta: content.cta,
    canva_brief: content.canva_brief,
    status: content.status,
    brief: content.brief,
    created_at: content.created_at,
    updated_at: content.updated_at,
  };
}

function fromSupabaseRow(value: unknown): GeneratedContent | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    id: toText(value.id),
    title: toText(value.title),
    hook: toText(value.hook),
    slides: Array.isArray(value.slides) ? value.slides : [],
    caption: toText(value.caption),
    hashtags: Array.isArray(value.hashtags) ? value.hashtags.map(toText).filter(Boolean) : [],
    cta: toText(value.cta),
    canva_brief: toText(value.canva_brief),
    status: isContentStatus(value.status) ? value.status : "draft",
    brief: isBrief(value.brief) ? value.brief : defaultBrief(),
    created_at: toText(value.created_at),
    updated_at: toText(value.updated_at),
  };
}

function isGeneratedContent(value: unknown): value is GeneratedContent {
  return isRecord(value) && typeof value.id === "string" && typeof value.title === "string";
}

function isBrief(value: unknown): value is ContentBrief {
  return (
    isRecord(value) &&
    typeof value.sector === "string" &&
    typeof value.goal === "string" &&
    typeof value.tone === "string" &&
    typeof value.product === "string" &&
    typeof value.slideCount === "number" &&
    typeof value.notes === "string"
  );
}

function defaultBrief(): ContentBrief {
  return {
    sector: "",
    goal: "",
    tone: "",
    product: "",
    slideCount: 8,
    notes: "",
  };
}

function isContentStatus(value: unknown): value is ContentStatus {
  return value === "draft" || value === "approved" || value === "posted";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

