import type { Metadata } from "next";
import { MenuClient } from "@/components/sazende/MenuClient";
import { getBusinessProfile } from "@/lib/sazende/business-info";
import { getMenuBySlug, getSeedMenu } from "@/lib/sazende/menu";
import { getMenuShareMetadata } from "@/lib/sazende/share-metadata";
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
        absolute: "Menü bulunamadı",
      },
      description: "Dijital menü bulunamadı.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const share = getMenuShareMetadata(menu);

  return {
    title: {
      absolute: share.title,
    },
    description: share.description,
    alternates: {
      canonical: share.canonicalUrl,
    },
    openGraph: {
      title: share.title,
      description: share.description,
      url: share.canonicalUrl,
      siteName: share.siteName,
      type: "website",
      locale: "tr_TR",
      images: [
        {
          url: share.image.url,
          width: share.image.width,
          height: share.image.height,
          alt: share.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: share.title,
      description: share.description,
      images: [share.image.url],
    },
  };
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;
  let menu;

  try {
    menu = (await getMenuBySlug(slug)) ?? getSeedMenu(slug);
  } catch {
    menu = getSeedMenu(slug);
  }

  if (!menu) {
    return <main className="status-shell">Menü bulunamadı.</main>;
  }

  return <MenuClient menu={menu} profile={getBusinessProfile(menu.business)} />;
}
