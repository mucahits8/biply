import type { BusinessMenu } from "@/types/menu";

export const publicSiteUrl = "https://www.biply.com.tr";

type ShareOverride = {
  name?: string;
  description?: string;
  shareImageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
};

const shareOverrides: Record<string, ShareOverride> = {
  sazende: {
    name: "Sazende",
    description: "Paça · İşkembe · Kebap · Pide · Döner · Ev Yemekleri",
    shareImageUrl: "/images/sazende-og.png",
    imageWidth: 1731,
    imageHeight: 909,
  },
  hamarat: {
    name: "Hamarat",
    description: "Pastane • Kafe • Fast Food",
    shareImageUrl: "/images/hamarat-hero.png",
    imageWidth: 1448,
    imageHeight: 1086,
  },
};

function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${publicSiteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getMenuShareMetadata(menu: BusinessMenu) {
  const override = shareOverrides[menu.business.slug] ?? {};
  const restaurantName = override.name ?? menu.business.name;
  const description = override.description ?? menu.business.subtitle;
  const shareImageUrl =
    override.shareImageUrl ?? menu.business.shareImageUrl ?? "/images/sazende-og.png";

  return {
    title: `${restaurantName} Dijital Menü`,
    description,
    siteName: restaurantName,
    canonicalUrl: `${publicSiteUrl}/menu/${menu.business.slug}`,
    image: {
      url: absoluteUrl(shareImageUrl),
      width: override.imageWidth ?? 1200,
      height: override.imageHeight ?? 630,
      alt: `${restaurantName} Dijital Menü`,
    },
  };
}
