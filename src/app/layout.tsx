import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import ScrollProgressIndicator from "@/components/motion/ScrollProgressIndicator";
import GoogleAnalyticsTracker from "@/components/analytics/GoogleAnalyticsTracker";
import dynamic from "next/dynamic";
import { getPublicSiteSettings, type PublicSiteSettings } from "@/lib/site-settings";

const MascotSupportAssistant = dynamic(
  () => import("@/components/mascot/MascotSupportAssistant"),
  { ssr: false }
);
const CustomCursor = dynamic(
  () => import("@/components/motion/CustomCursor"),
  { ssr: false }
);

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    default: "Nguyên Agency | Nguyễn Công Nguyên Media Quảng Ngãi",
    template: "%s | Nguyên Agency",
  },
  description:
    "Nguyên Agency – Nguyễn Công Nguyên Media tại Quảng Ngãi. Chuyên thiết kế website, logo, quảng cáo, Digital Marketing, phần mềm và giải pháp AI cho doanh nghiệp.",
  authors: [{ name: "Nguyễn Công Nguyên", url: "https://nguyenagency.online/nguyen-cong-nguyen" }],
  creator: "Nguyễn Công Nguyên",
  publisher: "NGUYÊN AGENCY",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "https://nguyenagency.online"
  ),
  alternates: {
    canonical: "https://nguyenagency.online",
  },
  openGraph: {
    title: "Nguyên Agency | Nguyễn Công Nguyên Media Quảng Ngãi",
    description:
      "Nguyên Agency – Nguyễn Công Nguyên Media tại Quảng Ngãi. Chuyên thiết kế website, logo, quảng cáo, Digital Marketing, phần mềm và giải pháp AI cho doanh nghiệp.",
    url: "https://nguyenagency.online",
    siteName: "NGUYÊN AGENCY",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nguyên Agency – Nguyễn Công Nguyên Media Quảng Ngãi",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyên Agency | Nguyễn Công Nguyên Media Quảng Ngãi",
    description:
      "Nguyên Agency – Nguyễn Công Nguyên Media tại Quảng Ngãi. Chuyên thiết kế website, logo, quảng cáo, Digital Marketing, phần mềm và giải pháp AI cho doanh nghiệp.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", rel: "icon" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", rel: "icon" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google65e91d408d51fefb",
    other: {
      "google-site-verification": [
        "google65e91d408d51fefb.html",
        "google65e91d408d51fefb",
      ],
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
    },
  },
};

const DEFAULT_SETTINGS: PublicSiteSettings = {
  brandName: "NGUYÊN AGENCY",
  brandTagline: "NÂNG TẦM THƯƠNG HIỆU",
  brandDescription: "Premium Creative Digital Agency tiên phong kết hợp giữa nghệ thuật thị giác đương đại, công nghệ 3D Three.js và kiến trúc phần mềm tốc độ cao.",
  contactEmail: "contact@nguyenagency.vn",
  hotline: "+84 344 979 307",
  officeAddress: "TP. Quảng Ngãi - TP. Hồ Chí Minh",
  zaloUrl: "https://zalo.me/0344979307",
  facebookUrl: "https://www.facebook.com/nguyenads7",
  linkedinUrl: "https://linkedin.com",
  behanceUrl: "https://behance.net",
  telegramBotUsername: "nguyenangency_bot",
  mascotEnabled: true,
  mascotName: "NGUYÊN AI ASSISTANT",
  mascotTitle: "Trợ lý trực tuyến",
  mascotGreeting: "Xin chào! 👋 Mình là trợ lý của NGUYÊN AGENCY. Bạn đang cần giải pháp truyền thông hay lập trình website?",
  mascotImage: "/assets/mascot/mascot.webp",
  mascotAnimationEnabled: true,
  mascotSizeDesktop: 125,
  mascotPosition: "bottom-right",
  rawMap: {},
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: PublicSiteSettings = DEFAULT_SETTINGS;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    // DB unavailable → use defaults; site still renders
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.brandName || "NGUYÊN AGENCY",
    "url": "https://nguyenagency.online",
    "logo": "https://nguyenagency.online/images/og-image.jpg",
    "image": "https://nguyenagency.online/images/og-image.jpg",
    "description": settings.brandDescription,
    "email": settings.contactEmail,
    "telephone": settings.hotline,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.officeAddress,
      "addressLocality": "Quảng Ngãi",
      "addressRegion": "Quảng Ngãi",
      "addressCountry": "VN",
    },
    "sameAs": [
      settings.facebookUrl,
      settings.linkedinUrl,
      settings.behanceUrl,
      settings.zaloUrl,
    ].filter(Boolean),
  };

  return (
    <html lang="vi" className="dark" style={{ backgroundColor: "#0A0A0A", colorScheme: "dark" }}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `html,body{background-color:#0A0A0A!important;color:#FFFFFF;}` }} />
        {/* Favicon & App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007BA7" />
        <meta name="msapplication-TileColor" content="#007BA7" />
        <meta name="msapplication-TileImage" content="/mstile-150x150.png" />
        <meta name="color-scheme" content="dark" />
        {/* OpenGraph Image */}
        <meta
          property="og:image"
          content="https://nguyenagency.online/images/og-image.jpg"
        />
        <meta
          property="og:image:secure_url"
          content="https://nguyenagency.online/images/og-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta
          property="og:image:alt"
          content="NGUYÊN AGENCY – VƯỢT CHUẨN SỐ HÓA"
        />
        <meta
          name="twitter:image"
          content="https://nguyenagency.online/images/og-image.jpg"
        />
        <meta
          name="google-site-verification"
          content="google65e91d408d51fefb"
        />
        <meta
          name="google-site-verification"
          content="google65e91d408d51fefb.html"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-[#0A0A0A] text-white selection:bg-[#FF2D95]/30 selection:text-white antialiased">
        <SmoothScrollProvider>
          <ScrollProgressIndicator />
          <CustomCursor />
          <Header
            brandName={settings.brandName}
            brandTagline={settings.brandTagline}
          />
          <main className="min-h-screen relative">{children}</main>
          <Footer
            brandName={settings.brandName}
            brandTagline={settings.brandTagline}
            brandDescription={settings.brandDescription}
            contactEmail={settings.contactEmail}
            hotline={settings.hotline}
            officeAddress={settings.officeAddress}
            zaloUrl={settings.zaloUrl}
            facebookUrl={settings.facebookUrl}
            linkedinUrl={settings.linkedinUrl}
            behanceUrl={settings.behanceUrl}
          />
          <MascotSupportAssistant settings={settings} />
        </SmoothScrollProvider>
        <GoogleAnalyticsTracker gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
