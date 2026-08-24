import type { Metadata } from "next";
import { AdminClient } from "@/components/sazende/AdminClient";
import "@/app/sazende-menu.css";

export const metadata: Metadata = {
  title: "Şazende Menü Yönetimi",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminSlugPage({ params }: Props) {
  const { slug } = await params;

  return <AdminClient slug={slug} />;
}
