import React from "react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ensureHomepageSections, DEFAULT_HOMEPAGE_SECTIONS } from "@/lib/homepage-init";
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

import type { Metadata } from "next";
import {
  getLocalBusinessSchema,
  getPersonSchema,
  SITE_URL,
} from "@/lib/seo-schemas";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nguyên Agency | Thiết Kế Website & Marketing Quảng Ngãi",
  description:
    "Nguyên Agency cung cấp dịch vụ thiết kế website, logo, nhận diện thương hiệu, Digital Marketing và giải pháp phần mềm tại Quảng Ngãi.",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Nguyên Agency | Thiết Kế Website & Marketing Quảng Ngãi",
    description:
      "Nguyên Agency cung cấp dịch vụ thiết kế website, logo, nhận diện thương hiệu, Digital Marketing và giải pháp phần mềm tại Quảng Ngãi.",
    url: `${SITE_URL}/`,
    siteName: "Nguyên Agency",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Nguyên Agency | Nguyễn Công Nguyên Media Quảng Ngãi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyên Agency | Nguyễn Công Nguyên Media Quảng Ngãi",
    description:
      "Nguyên Agency – Nguyễn Công Nguyên Media tại Quảng Ngãi. Chuyên thiết kế website, logo, quảng cáo, Digital Marketing, phần mềm và giải pháp AI cho doanh nghiệp.",
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
};

export default async function HomePage() {
  let homepageSections: any[] = [];
  let featuredPortfolios: any[] = [];
  let labProducts: any[] = [];
  let latestBlogPosts: any[] = [];
  let testimonials: any[] = [];
  let faqs: any[] = [];
  let siteSettings: any = null;

  try {
    const results = await Promise.all([
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

    homepageSections = results[0] || [];
    featuredPortfolios = results[1] || [];
    labProducts = results[2] || [];
    latestBlogPosts = results[3] || [];
    testimonials = results[4] || [];
    faqs = results[5] || [];
    siteSettings = results[6];
  } catch (err) {
    console.warn("[HomePage] DB load fallback active:", err);
  }

  // Graceful fallback to default sections if DB is not populated yet
  if (!homepageSections || homepageSections.length === 0) {
    homepageSections = DEFAULT_HOMEPAGE_SECTIONS.map((sec, idx) => ({
      ...sec,
      id: `default_${sec.sectionKey || idx}`,
    }));
  }

  const localBusinessSchema = getLocalBusinessSchema();
  const personSchema = getPersonSchema();

  return (
    <div className="flex flex-col">
      {/* Search Engine Structured Data (WebSite + Organization are in RootLayout) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
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
            // Render custom dynamic section created by Admin (with optional image)
            return (
              <section
                key={sec.id}
                className="py-24 px-6 bg-[#0A0A0A] border-b border-[#292929] text-white"
              >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                  <div
                    className={`${
                      sec.mediaUrl ? "lg:col-span-7" : "lg:col-span-12"
                    } space-y-5`}
                  >
                    {sec.subtitle && (
                      <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#007BA7] block">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                      {sec.title}
                    </h2>
                    {sec.description && (
                      <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl">
                        {sec.description}
                      </p>
                    )}
                    {sec.ctaText && sec.ctaLink && (
                      <div className="pt-2">
                        <a
                          href={sec.ctaLink}
                          className="inline-block px-6 py-3.5 rounded-full bg-gradient-to-r from-[#007BA7] to-[#FF2D95] text-white text-xs font-mono font-bold uppercase tracking-wider shrink-0"
                        >
                          {sec.ctaText}
                        </a>
                      </div>
                    )}
                  </div>
                  {sec.mediaUrl && (
                    <div className="lg:col-span-5 flex items-center justify-center">
                      <Image
                        src={sec.mediaUrl}
                        alt={sec.title}
                        width={640}
                        height={400}
                        loading="lazy"
                        quality={80}
                        className="w-full max-w-md h-auto rounded-2xl object-contain"
                      />
                    </div>
                  )}
                </div>
              </section>
            );
        }
      })}
    </div>
  );
}
