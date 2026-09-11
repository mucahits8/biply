export type BusinessCardLink = {
  label: string;
  description: string;
  href: string;
  kind: "linkedin" | "instagram" | "website" | "location" | "x" | "youtube";
  featured?: boolean;
};

export type BusinessCardProfile = {
  slug: string;
  aliases: string[];
  fullName: string;
  givenName: string;
  familyName: string;
  title: string;
  company: string;
  summary: string;
  locationLabel: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  website: string;
  profileUrl: string;
  accent: string;
  links: BusinessCardLink[];
};

export const businessCardProfiles: BusinessCardProfile[] = [
  {
    slug: "mucahitsevim",
    aliases: ["mucahit"],
    fullName: "Mücahit Sevim",
    givenName: "Mücahit",
    familyName: "Sevim",
    title: "Sales & Business Development",
    company: "Biply",
    summary: "NFC çözümleri ve dijital kartvizitlerle daha fazla bağlantı, daha hızlı iletişim.",
    locationLabel: "Istanbul",
    address: "Istanbul, Turkiye",
    phone: "+905446061461",
    phoneDisplay: "0544 606 14 61",
    whatsapp: "+905446061461",
    email: "mucahit@biply.com.tr",
    website: "https://www.biply.com.tr",
    profileUrl: "https://www.biply.com.tr/kartvizit/mucahitsevim",
    accent: "#174A9C",
    links: [
      {
        label: "LinkedIn Profili",
        description: "Profesyonel ağımda bağlantı kurun",
        href: "https://www.linkedin.com/in/mucahit-sevim",
        kind: "linkedin",
        featured: true,
      },
      {
        label: "Instagram",
        description: "@msevim8",
        href: "https://www.instagram.com/msevim8",
        kind: "instagram",
        featured: true,
      },
      {
        label: "Web Sitesi",
        description: "Biply çözümlerini keşfedin",
        href: "https://www.biply.com.tr",
        kind: "website",
        featured: true,
      },
      {
        label: "Konum",
        description: "Ofisimize yol tarifi alın",
        href: "https://maps.google.com/?q=Istanbul",
        kind: "location",
      },
    ],
  },
];

export function getBusinessCardProfile(slug: string) {
  return businessCardProfiles.find((profile) => profile.slug === slug || profile.aliases.includes(slug));
}
