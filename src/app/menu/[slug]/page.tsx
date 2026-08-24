import type { Metadata } from "next";
import { MenuClient } from "@/components/sazende/MenuClient";
import { businessInfo } from "@/lib/sazende/business-info";
import { getMenuBySlug, getSeedMenu } from "@/lib/sazende/menu";
import "@/app/sazende-menu.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const menu = await getMenuBySlug(slug).catch(() => getSeedMenu(slug));

  return {
    title: menu ? `${businessInfo.displayName} Dijital Menü` : "Menü bulunamadı",
    description: menu
      ? `${businessInfo.displayName} Paça İşkembe Kebap dijital menüsü.`
      : "Dijital menü bulunamadı.",
  };
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;
  let menu;

  try {
    menu = await getMenuBySlug(slug);
  } catch {
    menu = getSeedMenu(slug);
  }

  if (!menu) {
    return <main className="status-shell">Menü bulunamadı.</main>;
  }

  return <MenuClient menu={menu} />;
}
