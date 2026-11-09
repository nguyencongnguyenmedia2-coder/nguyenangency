import { NextResponse } from "next/server";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getPublicSiteSettings();
  return NextResponse.json({
    ok: true,
    settings,
  });
}
