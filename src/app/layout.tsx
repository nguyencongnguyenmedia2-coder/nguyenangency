import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/motion/CustomCursor";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import ScrollProgressIndicator from "@/components/motion/ScrollProgressIndicator";
import TelegramFloatingButton from "@/components/layout/TelegramFloatingButton";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "NGUYÊN AGENCY – BEYOND DIGITAL | Premium Creative Digital Agency",
  description:
    "We Create. We Build. We Transform. Nền tảng Digital Agency cao cấp kết hợp nghệ thuật thị giác Luxury Dark, công nghệ 3D Three.js và kiến trúc Next.js.",
  keywords: [
    "NGUYÊN AGENCY",
    "Digital Agency Vietnam",
    "3D Creative Agency",
    "Three.js Agency",
    "Luxury Branding",
    "Web Application",
    "Next.js Developer",
  ],
  authors: [{ name: "NGUYÊN AGENCY", url: "https://nguyenagency.vn" }],
  creator: "NGUYÊN AGENCY",
  metadataBase: new URL("https://nguyenagency.vn"),
  openGraph: {
    title: "NGUYÊN AGENCY – BEYOND DIGITAL",
    description: "We Create. We Build. We Transform.",
    url: "https://nguyenagency.vn",
    siteName: "NGUYÊN AGENCY",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "NGUYÊN AGENCY Preview",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  verification: {
    google: "google65e91d408d51fefb",
    other: {
      "google-site-verification": [
        "google65e91d408d51fefb.html",
        "google65e91d408d51fefb",
      ],
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSiteSettings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.brandName || "NGUYÊN AGENCY",
    "url": "https://nguyenagency.vn",
    "logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "description": settings.brandDescription,
    "email": settings.contactEmail,
    "telephone": settings.hotline,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.officeAddress,
      "addressLocality": "Hồ Chí Minh",
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
    <html lang="vi" className="dark">
      <head>
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
          <TelegramFloatingButton />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
