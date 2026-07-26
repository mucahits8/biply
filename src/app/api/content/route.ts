import { listGeneratedContent, updateContentStatus } from "@/lib/content-studio/storage";
import type { ContentStatus } from "@/lib/content-studio/types";

export async function GET() {
  const result = await listGeneratedContent();

  return Response.json({
    contents: result.data,
    storage: result.storage,
    warning: result.warning,
  });
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const id = typeof payload.id === "string" ? payload.id : "";
    const status = payload.status;

    if (!id || !isContentStatus(status)) {
      return Response.json({ error: "Geçerli id ve status gerekli." }, { status: 400 });
    }

    const result = await updateContentStatus(id, status);

    return Response.json({
      content: result.data,
      storage: result.storage,
      warning: result.warning,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Status güncellenemedi." },
      { status: 500 },
    );
  }
}

function isContentStatus(value: unknown): value is ContentStatus {
  return value === "draft" || value === "approved" || value === "posted";
}

