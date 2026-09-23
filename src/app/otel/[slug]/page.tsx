import type { Metadata } from "next";

interface OtelPageProps {
  params: Promise<{ slug: string }>;
}

const HOTEL_APP_ORIGIN = "https://hotels-arayuz.mucahits8.chatgpt.site";

export async function generateMetadata({ params }: OtelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hotelName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${hotelName} | Biply`,
    description: `${hotelName} misafirleri icin dijital otel deneyimi.`,
    robots: { index: false, follow: false },
  };
}

export default async function OtelPage({ params }: OtelPageProps) {
  const { slug } = await params;
  const hotelUrl = `${HOTEL_APP_ORIGIN}/otel/${encodeURIComponent(slug)}`;

  return (
    <main className="fixed inset-0 z-[100] bg-[#f7f2ea]">
      <iframe
        title="Biply otel misafir deneyimi"
        src={hotelUrl}
        className="h-full w-full border-0"
        allow="clipboard-read; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </main>
  );
}
