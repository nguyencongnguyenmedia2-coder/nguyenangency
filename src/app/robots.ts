import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://nguyenagency.online";

  const privateDisallows = ["/admin/", "/Admin/", "/client/", "/api/", "/quotation/"];

  return {
    rules: [
      // Search engine & AI Search crawlers (indexing & retrieval)
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: privateDisallows,
      },
      // AI model training crawlers (configurable per site data policy)
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: privateDisallows,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

