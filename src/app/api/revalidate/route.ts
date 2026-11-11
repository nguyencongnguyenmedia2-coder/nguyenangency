import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Force revalidate all public-facing pages.
 * Protected by REVALIDATE_SECRET env var.
 * Usage: POST /api/revalidate { secret: "...", paths: ["/", "/services"] }
 * Or:    GET  /api/revalidate?secret=...&path=/services
 */

const ALL_PUBLIC_PATHS = [
  "/",
  "/services",
  "/portfolio",
  "/lab",
  "/blog",
  "/pricing",
  "/contact",
  "/about",
  "/faq",
  "/sitemap.xml",
];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const path = req.nextUrl.searchParams.get("path");

  if (secret !== (process.env.REVALIDATE_SECRET || "nguyen-agency-revalidate-2026")) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const pathsToRevalidate = path ? [path] : ALL_PUBLIC_PATHS;

  for (const p of pathsToRevalidate) {
    try {
      revalidatePath(p, "layout");
      revalidatePath(p, "page");
    } catch {}
  }

  return NextResponse.json({
    revalidated: true,
    paths: pathsToRevalidate,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, paths } = body;

    if (secret !== (process.env.REVALIDATE_SECRET || "nguyen-agency-revalidate-2026")) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const pathsToRevalidate: string[] = Array.isArray(paths) && paths.length > 0
      ? paths
      : ALL_PUBLIC_PATHS;

    for (const p of pathsToRevalidate) {
      try {
        revalidatePath(p, "layout");
        revalidatePath(p, "page");
      } catch {}
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

