import type { Metadata } from "next";
import { ContentStudioClient } from "@/components/content-studio/ContentStudioClient";

export const metadata: Metadata = {
  title: "Content Studio",
  description: "Biply için Instagram ve TikTok carousel içerikleri üretin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContentStudioPage() {
  return <ContentStudioClient />;
}

