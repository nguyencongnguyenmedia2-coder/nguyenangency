import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nguyenagency.vn";

  // Static marketing routes
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/lab",
    "/pricing",
    "/blog",
    "/contact",
    "/faq",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // Dynamic published services
    const services = await prisma.service.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    const serviceRoutes = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    // Dynamic published portfolio case studies
    const portfolios = await prisma.portfolio.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    const portfolioRoutes = portfolios.map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

    // Dynamic published LAB products
    const labProducts = await prisma.labProduct.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    const labRoutes = labProducts.map((l) => ({
      url: `${baseUrl}/lab/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    // Dynamic published blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, publishedAt: true },
    });
    const blogRoutes = blogPosts.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.publishedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    return [
      ...staticRoutes,
      ...serviceRoutes,
      ...portfolioRoutes,
      ...labRoutes,
      ...blogRoutes,
    ];
  } catch (error) {
    console.warn("[sitemap] Failed to load dynamic database routes, returning static routes:", error);
    return staticRoutes;
  }
}

