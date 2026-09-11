import { redirect } from "next/navigation";
import { getBusinessCardProfile } from "@/data/business-cards";

type BusinessCardPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [{ slug: "mucahit" }];
}

export default async function BusinessCardPage({ params }: BusinessCardPageProps) {
  const { slug } = await params;
  const profile = getBusinessCardProfile(slug);

  if (!profile) {
    redirect("/kartvizit");
  }

  redirect(`/kartvizit/${profile.slug}`);
}
