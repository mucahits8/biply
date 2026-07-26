export type ContentStatus = "draft" | "approved" | "posted";

export type ContentBrief = {
  sector: string;
  goal: string;
  tone: string;
  product: string;
  slideCount: number;
  notes: string;
};

export type CarouselSlide = {
  slide: number;
  headline: string;
  body: string;
  visual_direction: string;
};

export type GeneratedContent = {
  id: string;
  title: string;
  hook: string;
  slides: CarouselSlide[];
  caption: string;
  hashtags: string[];
  cta: string;
  canva_brief: string;
  status: ContentStatus;
  brief: ContentBrief;
  created_at: string;
  updated_at: string;
};

export type GeneratedContentDraft = Omit<GeneratedContent, "id" | "status" | "brief" | "created_at" | "updated_at">;

export type GenerateContentResponse = {
  content: GeneratedContent;
  storage: "supabase" | "local";
  warning?: string;
};

