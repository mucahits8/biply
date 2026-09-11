import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCardClient } from "@/components/business-card/BusinessCardClient";
import { getBusinessCardProfile } from "@/data/business-cards";

type BusinessCardPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BusinessCardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getBusinessCardProfile(slug);

  if (!profile) {
    return {
      title: "Dijital Kartvizit",
    };
  }

  return {
    title: `${profile.fullName} Dijital Kartvizit`,
    description: `${profile.fullName} iletişim bilgileri, sosyal profilleri ve rehbere kaydetme bağlantısı.`,
    alternates: {
      canonical: profile.profileUrl,
    },
    openGraph: {
      title: `${profile.fullName} | Biply Dijital Kartvizit`,
      description: profile.summary,
      url: profile.profileUrl,
      type: "profile",
      locale: "tr_TR",
    },
  };
}

export async function generateStaticParams() {
  return [{ slug: "mucahitsevim" }];
}

export default async function BusinessCardPage({ params }: BusinessCardPageProps) {
  const { slug } = await params;
  const profile = getBusinessCardProfile(slug);

  if (!profile) {
    notFound();
  }

  return <BusinessCardClient profile={profile} />;
}
