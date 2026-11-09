import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nguyen-agency-beyond-digital-ultra-secret-key-2026"
);

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const lowerPath = pathname.toLowerCase();

  // Handle /admin, /Admin, /ADMIN (case-insensitive)
  if (lowerPath === "/admin" || lowerPath.startsWith("/admin/")) {
    const isLoginPage = lowerPath === "/admin/login";

    // Extract session cookie
    const token = request.cookies.get("nguyen_session_token")?.value;

    if (!token) {
      if (!isLoginPage) {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }
      // If visiting /Admin/login with uppercase, rewrite to /admin/login
      if (pathname !== lowerPath) {
        url.pathname = lowerPath;
        return NextResponse.rewrite(url);
      }
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
      return res;
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = (payload as any).role;

      // Only SUPER_ADMIN, ADMIN, and STAFF can access /admin
      const isStaffOrAdmin = role === "SUPER_ADMIN" || role === "ADMIN" || role === "STAFF";

      if (!isStaffOrAdmin) {
        if (isLoginPage) {
          url.pathname = "/client/dashboard";
          return NextResponse.redirect(url);
        }
        return new NextResponse("403 Forbidden: Access Denied to Administrative Systems.", {
          status: 403,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      // If already logged in as Admin and visiting login page, redirect to Dashboard
      if (isLoginPage) {
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }

      // If path has uppercase letters (e.g. /Admin or /Admin/Services), rewrite to lowercase /admin/...
      if (pathname !== lowerPath) {
        url.pathname = lowerPath;
        const rewriteRes = NextResponse.rewrite(url);
        rewriteRes.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
        return rewriteRes;
      }
    } catch {
      // Invalid or expired token
      if (!isLoginPage) {
        url.pathname = "/admin/login";
        const response = NextResponse.redirect(url);
        response.cookies.delete("nguyen_session_token");
        return response;
      }
    }
  }

  const response = NextResponse.next();
  if (lowerPath.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/Admin",
    "/Admin/:path*",
    "/ADMIN",
    "/ADMIN/:path*",
  ],
};
