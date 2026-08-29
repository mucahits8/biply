import type { Metadata } from "next";
import { PosClient } from "@/components/sazende/PosClient";
import { getBusinessProfile } from "@/lib/sazende/business-info";
import { getMenuBySlug, getSeedMenu } from "@/lib/sazende/menu";
import "@/app/sazende-menu.css";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const menu = (await getMenuBySlug(slug).catch(() => null)) ?? getSeedMenu(slug);

  if (!menu) {
    return {
      title: {
        absolute: "POS bulunamadı",
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: {
      absolute: `${menu.business.name} Adisyon`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PosPage({ params }: Props) {
  const { slug } = await params;
  let menu;

  try {
    menu = (await getMenuBySlug(slug)) ?? getSeedMenu(slug);
  } catch {
    menu = getSeedMenu(slug);
  }

  if (!menu) {
    return <main className="status-shell">POS bulunamadı.</main>;
  }

  return <PosClient menu={menu} profile={getBusinessProfile(menu.business)} />;
}
