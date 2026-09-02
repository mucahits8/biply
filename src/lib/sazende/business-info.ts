import type { BusinessSummary } from "@/types/menu";

export type BusinessPhone = {
  label: string;
  href: string;
};

export type BusinessTheme = {
  mode?: "light" | "dark";
  background?: string;
  surface?: string;
  surfaceStrong?: string;
  ink?: string;
  soft?: string;
  faint?: string;
  accent?: string;
  accentStrong?: string;
  line?: string;
  shadow?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  glow?: string;
  wash?: string;
  gridLine?: string;
};

export type BusinessCampaign = {
  enabled: boolean;
  badge: string;
  title: string;
  titleHighlight?: string;
  copy: string;
  copyHighlight?: string;
  info: string;
  chip?: string;
  giftLabel?: string;
  storageKey?: string;
  actionLabel: string;
  actionHref?: string | null;
  actionIcon?: "google" | "menu";
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  secondaryActionIcon?: "instagram";
  continueLabel: string;
  photoUrl?: string;
};

export type BusinessProfile = {
  slug: string;
  displayName: string;
  brandDescriptor?: string;
  tagline?: string;
  subtitle: string;
  useFallbackDescriptions?: boolean;
  heroMode?: "composed" | "poster";
  heroImageUrl?: string;
  logoUrl?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  address?: string;
  mapUrl?: string;
  phones: BusinessPhone[];
  acceptedPayments: string[];
  reviewUrl?: string;
  priceUpdatedText?: string;
  campaign?: BusinessCampaign;
  theme?: BusinessTheme;
};

type ProfileOverride = Partial<Omit<BusinessProfile, "slug" | "phones" | "acceptedPayments">> & {
  phones?: BusinessPhone[];
  acceptedPayments?: string[];
};

const profileOverrides: Record<string, ProfileOverride> = {
  sazende: {
    displayName: "Şazende",
    subtitle: "Çorba · Kebap · Pide · Döner · Ev Yemekleri",
    useFallbackDescriptions: true,
    heroMode: "poster",
    heroImageUrl: "/images/sazende-header.png",
    instagramHandle: "sazendecorba",
    instagramUrl: "https://www.instagram.com/sazendecorba/",
    address: "Mahmut Şevket Paşa Mah. Fevzi Çakmak Cad. No:17 Okmeydanı / İstanbul",
    phones: [
      { label: "0212 361 44 41", href: "tel:+902123614441" },
      { label: "0212 250 10 25", href: "tel:+902122501025" },
      { label: "0507 087 00 11", href: "tel:+905070870011" },
    ],
    acceptedPayments: ["Sodexo", "Ticket Restaurant", "Multinet", "Visa", "Mastercard"],
    priceUpdatedText: "Fiyatlar 31.08.2026 tarihinde güncellenmiştir.",
    reviewUrl:
      "https://www.google.com/search?q=%C5%9Eazende+Pa%C3%A7a+%C4%B0%C5%9Fkembe+Kebap+Google+yorum",
    campaign: {
      enabled: true,
      badge: "Hoş Geldiniz",
      title: "Sazende Menüsü Artık Dijitalde!",
      copy: "Çorbalar, kebaplar, pideler ve daha fazlasını tek ekranda kolayca inceleyin.",
      info: "Ürün detayları, fiyat, kcal ve alerjen bilgileri menüde yer alır.",
      storageKey: "welcome-v1",
      actionLabel: "Menüyü Keşfet",
      actionHref: null,
      actionIcon: "menu",
      secondaryActionLabel: "Instagram'da Takip Et",
      secondaryActionHref: "https://www.instagram.com/sazendecorba/",
      secondaryActionIcon: "instagram",
      continueLabel: "Menüye Devam Et",
      photoUrl: "/images/sazende-karisik-izgara.jpg",
    },
  },
  hamarat: {
    displayName: "Hamarat",
    brandDescriptor: "Pastane & Kafe",
    tagline: "her tat bir sanat",
    subtitle: "Pastane • Kafe • Fast Food",
    useFallbackDescriptions: false,
    heroMode: "poster",
    heroImageUrl: "/images/hamarat-hero.png",
    logoUrl: "/images/hamarat-logo.png",
    address: "Yaylacık, Düzköy Cd. No:16, 61300 Akçaabat/Trabzon",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Yaylac%C4%B1k%2C%20D%C3%BCzk%C3%B6y%20Cd.%20No%3A16%2C%2061300%20Ak%C3%A7aabat%2FTrabzon",
    instagramHandle: "hamaratlezzetcomtr",
    instagramUrl: "https://www.instagram.com/hamaratlezzetcomtr/",
    phones: [{ label: "(0462) 228 61 94", href: "tel:+904622286194" }],
    acceptedPayments: [],
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJE16N8ZoVZEAR1PHCiOdvjIs",
    campaign: {
      enabled: true,
      badge: "HAMARAT'TAN",
      title: "Yorumunu göster, tatlı sürprizi yakala",
      titleHighlight: "tatlı sürprizi",
      copy: "Google'da yorumunu yap, kasada göster; sana özel küçük ikram fırsatını sor.",
      copyHighlight: "küçük ikram fırsatını",
      info: "Kampanya koşulları işletme tarafından güncellenebilir.",
      chip: "Google yoruma özel",
      giftLabel: "Küçük İkram Fırsatı",
      actionLabel: "Google'da Yorum Yap",
      continueLabel: "Menüye Geç",
      photoUrl: "/images/hamarat-yas-pasta.png",
    },
    theme: {
      background: "#f5ead9",
      surface: "rgba(255, 250, 241, 0.94)",
      surfaceStrong: "#fff8ec",
      ink: "#3d2517",
      soft: "#7a604f",
      faint: "#a48570",
      accent: "#b75b3f",
      accentStrong: "#8f442e",
      line: "rgba(162, 103, 67, 0.24)",
      shadow: "0 18px 42px rgba(89, 51, 27, 0.13)",
      fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      headingFontFamily: "Georgia, \"Times New Roman\", serif",
      glow: "radial-gradient(circle at 50% -16%, rgba(255, 255, 255, 0.95), transparent 21rem)",
      wash: "linear-gradient(145deg, rgba(183, 91, 63, 0.1), transparent 19rem)",
      gridLine: "rgba(162, 103, 67, 0.045)",
    },
  },
};

function fallbackDisplayName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toLocaleUpperCase("tr-TR") + part.slice(1))
    .join(" ");
}

export function getBusinessProfile(business: BusinessSummary): BusinessProfile {
  const override = profileOverrides[business.slug] ?? {};

  return {
    slug: business.slug,
    displayName: override.displayName ?? business.name,
    brandDescriptor: override.brandDescriptor,
    tagline: override.tagline,
    subtitle: override.subtitle ?? business.subtitle,
    useFallbackDescriptions: override.useFallbackDescriptions ?? false,
    heroMode: override.heroMode,
    heroImageUrl: override.heroImageUrl,
    logoUrl: override.logoUrl,
    phones: override.phones ?? [],
    acceptedPayments: override.acceptedPayments ?? [],
    instagramHandle: override.instagramHandle,
    instagramUrl: override.instagramUrl,
    address: override.address,
    mapUrl: override.mapUrl,
    reviewUrl: override.reviewUrl,
    priceUpdatedText: override.priceUpdatedText,
    campaign: override.campaign,
    theme: override.theme,
  };
}

export function getBusinessProfileBySlug(slug: string): BusinessProfile {
  const override = profileOverrides[slug] ?? {};
  const displayName = override.displayName ?? fallbackDisplayName(slug);

  return {
    slug,
    displayName,
    brandDescriptor: override.brandDescriptor,
    tagline: override.tagline,
    subtitle: override.subtitle ?? "Dijital Menü",
    useFallbackDescriptions: override.useFallbackDescriptions ?? false,
    heroMode: override.heroMode,
    heroImageUrl: override.heroImageUrl,
    logoUrl: override.logoUrl,
    phones: override.phones ?? [],
    acceptedPayments: override.acceptedPayments ?? [],
    instagramHandle: override.instagramHandle,
    instagramUrl: override.instagramUrl,
    address: override.address,
    mapUrl: override.mapUrl,
    reviewUrl: override.reviewUrl,
    priceUpdatedText: override.priceUpdatedText,
    campaign: override.campaign,
    theme: override.theme,
  };
}

export function getCampaignStorageKey(slug: string, campaignKey = "default") {
  return `biply_campaign_seen_${slug}_${campaignKey}`;
}
