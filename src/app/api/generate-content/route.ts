import { generateCarouselContent } from "@/lib/content-studio/generator";
import { saveGeneratedContent } from "@/lib/content-studio/storage";
import type { ContentBrief, GenerateContentResponse } from "@/lib/content-studio/types";

export async function POST(request: Request) {
  try {
    const brief = normalizeBrief(await request.json());
    const draft = await generateCarouselContent(brief);
    const result = await saveGeneratedContent(draft, brief);
    const response: GenerateContentResponse = {
      content: result.data,
      storage: result.storage,
      warning: result.warning,
    };

    return Response.json(response);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "İçerik üretimi başarısız oldu." },
      { status: 500 },
    );
  }
}

function normalizeBrief(value: unknown): ContentBrief {
  if (typeof value !== "object" || value === null) {
    throw new Error("Form verisi eksik.");
  }

  const record = value as Record<string, unknown>;
  const slideCount = Number(record.slideCount);

  return {
    sector: requiredText(record.sector, "Sektör"),
    goal: requiredText(record.goal, "İçerik amacı"),
    tone: requiredText(record.tone, "Ton"),
    product: requiredText(record.product, "Ürün"),
    slideCount: Number.isFinite(slideCount) ? Math.min(Math.max(slideCount, 7), 10) : 8,
    notes: typeof record.notes === "string" ? record.notes.trim() : "",
  };
}

function requiredText(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} alanı zorunlu.`);
  }

  return value.trim();
}

