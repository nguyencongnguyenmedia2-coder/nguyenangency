import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://nguyenagency.online";

  // Static marketing & target SEO landing routes
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/nguyen-cong-nguyen", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/thiet-ke-website-quang-ngai", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/media-quang-ngai", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/digital-marketing-quang-ngai", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/thiet-ke-logo", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/ai-automation", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/du-an", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/lien-he", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/portfolio", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/lab", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  ].map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
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

