import { NextResponse } from "next/server";
import { getBusinessCardProfile } from "@/data/business-cards";

export async function GET(request: Request, context: RouteContext<"/c/[slug]/vcard">) {
  const { slug } = await context.params;
  const profile = getBusinessCardProfile(slug);

  if (!profile) {
    return NextResponse.redirect(new URL("/kartvizit", request.url));
  }

  return NextResponse.redirect(new URL(`/kartvizit/${profile.slug}/vcard`, request.url));
}
