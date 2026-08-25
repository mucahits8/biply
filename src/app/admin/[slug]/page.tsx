import type { Metadata } from "next";
import { AdminClient } from "@/components/sazende/AdminClient";
import { getBusinessProfileBySlug } from "@/lib/sazende/business-info";
import "@/app/sazende-menu.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = getBusinessProfileBySlug(slug);

  return {
    title: `${profile.displayName} Menü Yönetimi`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminSlugPage({ params }: Props) {
  const { slug } = await params;

  return <AdminClient slug={slug} />;
}
