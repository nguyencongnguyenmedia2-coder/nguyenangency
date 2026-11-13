/**
 * Schema.org JSON-LD Structured Data Builders for NGUYÊN AGENCY & Nguyễn Công Nguyên
 * Designed strictly following Google Search Central guidelines.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://nguyenagency.online";

export const BRAND_INFO = {
  name: "Nguyên Agency",
  alternateName: [
    "Nguyễn Công Nguyên Media Quảng Ngãi",
    "NGUYÊN AGENCY",
    "Nguyên Media",
    "Nguyễn Công Nguyên Media",
    "Nguyễn Công Nguyên Agency",
  ],
  slogan: "NÂNG TẦM THƯƠNG HIỆU",
  founder: "Nguyễn Công Nguyên",
  hotline: "+84344979307",
  email: "contact@nguyenagency.vn",
  officialFacebook: "https://www.facebook.com/nguyenagency07",
  address: {
    street: "TP. Quảng Ngãi",
    locality: "Quảng Ngãi",
    region: "Quảng Ngãi",
    country: "VN",
  },
  socials: [
    "https://www.facebook.com/nguyenagency07",
    "https://zalo.me/0344979307",
    "https://t.me/nguyenangency_bot",
  ],
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/og-image.jpg`,
};

export function getWebsiteAndOrganizationSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Nguyên Agency | Thiết Kế Website & Marketing Quảng Ngãi",
      description:
        "Nguyên Agency cung cấp dịch vụ thiết kế website, logo, nhận diện thương hiệu, Digital Marketing và giải pháp phần mềm tại Quảng Ngãi.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "vi-VN",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND_INFO.name,
      alternateName: BRAND_INFO.alternateName,
      url: `${SITE_URL}/`,
      logo: BRAND_INFO.logo,
      image: BRAND_INFO.image,
      slogan: BRAND_INFO.slogan,
      telephone: BRAND_INFO.hotline,
      founder: {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: BRAND_INFO.founder,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: BRAND_INFO.hotline,
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["vi", "en"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: BRAND_INFO.address.locality,
        addressRegion: BRAND_INFO.address.region,
        addressCountry: BRAND_INFO.address.country,
      },
      sameAs: BRAND_INFO.socials,
    },
  ];
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Nguyên Agency – Nguyễn Công Nguyên Media Quảng Ngãi",
    alternateName: "Nguyên Media Quảng Ngãi",
    image: BRAND_INFO.image,
    url: `${SITE_URL}/`,
    telephone: BRAND_INFO.hotline,
    parentOrganization: {
      "@id": `${SITE_URL}/#organization`,
    },
    priceRange: "15.000.000 VNĐ - 95.000.000 VNĐ",
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND_INFO.address.street,
      addressLocality: BRAND_INFO.address.locality,
      addressRegion: BRAND_INFO.address.region,
      postalCode: "57000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "15.1205",
      longitude: "108.7923",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Quảng Ngãi",
      },
      {
        "@type": "Country",
        name: "Việt Nam",
      },
    ],
    sameAs: BRAND_INFO.socials,
  };
}

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: "Nguyễn Công Nguyên",
    alternateName: ["Nguyen Cong Nguyen", "Nguyên Media", "Nguyên MMO"],
    url: `${SITE_URL}/nguyen-cong-nguyen`,
    image: `${SITE_URL}/images/og-image.jpg`,
    jobTitle: "Founder & Creative Technical Director",
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND_INFO.name,
    },
    description:
      "Nguyễn Công Nguyên là Founder & Giám đốc Kỹ thuật tại Nguyên Agency (Nguyên Media) tại Quảng Ngãi. Chuyên gia thiết kế website 3D WebGL, bộ nhận diện thương hiệu, Digital Marketing và tự động hóa AI cho doanh nghiệp.",
    homeLocation: {
      "@type": "Place",
      name: "Quảng Ngãi, Việt Nam",
    },
    sameAs: BRAND_INFO.socials,
  };
}

export function getServiceSchema({
  name,
  description,
  url,
  providerName = "NGUYÊN AGENCY",
  serviceType,
  areaServed = "Quảng Ngãi, Việt Nam",
}: {
  name: string;
  description: string;
  url: string;
  providerName?: string;
  serviceType?: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${url}`,
    provider: {
      "@type": "LocalBusiness",
      name: providerName,
      url: SITE_URL,
      telephone: BRAND_INFO.hotline,
    },
    serviceType: serviceType || name,
    areaServed: {
      "@type": "AdministrativeArea",
      name: areaServed,
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getWebPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: "vi-VN",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  };
}

