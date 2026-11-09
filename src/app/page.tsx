import React from "react";
import prisma from "@/lib/prisma";
import { ensureHomepageSections } from "@/lib/homepage-init";
import { getPublicSiteSettings } from "@/lib/site-settings";
import HeroSection from "@/components/home/HeroSection";
import BrandIntroSection from "@/components/home/BrandIntroSection";
import ServicesBentoSection from "@/components/home/ServicesBentoSection";
import FeaturedPortfolioSection from "@/components/home/FeaturedPortfolioSection";
import DigitalLabSection from "@/components/home/DigitalLabSection";
import ProcessSection from "@/components/home/ProcessSection";
import TechStackSection from "@/components/home/TechStackSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LatestBlogSection from "@/components/home/LatestBlogSection";
import FAQSection from "@/components/home/FAQSection";
import ContactCTASection from "@/components/home/ContactCTASection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Ensure default homepage sections exist in DB
  await ensureHomepageSections();

  // Fetch data from DB for dynamic public sections + HomepageSection configurations
  const [
    homepageSections,
    featuredPortfolios,
    labProducts,
    latestBlogPosts,
    testimonials,
    faqs,
    siteSettings,
  ] = await Promise.all([
    prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.portfolio.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      include: { category: true },
      orderBy: [
        { isFeatured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
      take: 3,
    }),
    prisma.labProduct.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      include: { category: true },
      orderBy: [
        { isFeatured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.testimonial.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.fAQ.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: 5,
    }),
    getPublicSiteSettings(),
  ]);

  return (
    <div className="flex flex-col">
      {homepageSections.map((sec) => {
        switch (sec.sectionKey) {
          case "HERO":
            return <HeroSection key={sec.id} sectionData={sec} />;
          case "BRAND_INTRO":
            return <BrandIntroSection key={sec.id} sectionData={sec} />;
          case "SERVICES_BENTO":
            return <ServicesBentoSection key={sec.id} sectionData={sec} />;
          case "FEATURED_PORTFOLIO":
            return (
              <FeaturedPortfolioSection
                key={sec.id}
                portfolios={featuredPortfolios}
                sectionData={sec}
              />
            );
          case "DIGITAL_LAB":
            return (
              <DigitalLabSection
                key={sec.id}
                products={labProducts}
                sectionData={sec}
              />
            );
          case "PROCESS":
            return <ProcessSection key={sec.id} sectionData={sec} />;
          case "TECH_STACK":
            return <TechStackSection key={sec.id} sectionData={sec} />;
          case "TESTIMONIALS":
            return (
              <TestimonialsSection
                key={sec.id}
                testimonials={testimonials}
                sectionData={sec}
              />
            );
          case "LATEST_BLOG":
            return (
              <LatestBlogSection
                key={sec.id}
                posts={latestBlogPosts}
                sectionData={sec}
              />
            );
          case "FAQ":
            return <FAQSection key={sec.id} faqs={faqs} sectionData={sec} />;
          case "CONTACT_CTA":
            return (
              <ContactCTASection
                key={sec.id}
                sectionData={sec}
                siteSettings={siteSettings}
              />
            );
          default:
            // Render custom dynamic section created by Admin
            return (
              <section
                key={sec.id}
                className="py-24 px-6 bg-[#0A0A0A] border-b border-[#292929] text-white"
              >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-2xl space-y-4">
                    {sec.subtitle && (
                      <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#007BA7] block">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                      {sec.title}
                    </h2>
                    {sec.description && (
                      <p className="text-sm text-[#A1A1AA] leading-relaxed">
                        {sec.description}
                      </p>
                    )}
                  </div>
                  {sec.ctaText && sec.ctaLink && (
                    <a
                      href={sec.ctaLink}
                      className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider shrink-0"
                    >
                      {sec.ctaText}
                    </a>
                  )}
                </div>
              </section>
            );
        }
      })}
    </div>
  );
}
