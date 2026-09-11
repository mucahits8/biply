import { notFound } from "next/navigation";
import { getBusinessCardProfile } from "@/data/business-cards";

function escapeVCardValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(_request: Request, context: RouteContext<"/kartvizit/[slug]/vcard">) {
  const { slug } = await context.params;
  const profile = getBusinessCardProfile(slug);

  if (!profile) {
    notFound();
  }

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(profile.familyName)};${escapeVCardValue(profile.givenName)};;;`,
    `FN:${escapeVCardValue(profile.fullName)}`,
    `ORG:${escapeVCardValue(profile.company)}`,
    `TITLE:${escapeVCardValue(profile.title)}`,
    `TEL;TYPE=CELL,VOICE:${profile.phone}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL:${profile.website}`,
    `PHOTO;VALUE=URI:${profile.photoUrl}`,
    `ADR;TYPE=WORK:;;${escapeVCardValue(profile.address)};;;;`,
    `NOTE:${escapeVCardValue(profile.summary)}`,
    "END:VCARD",
  ].join("\r\n");

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
