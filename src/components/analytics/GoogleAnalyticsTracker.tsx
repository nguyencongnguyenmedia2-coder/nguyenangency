"use client";

import { useEffect } from "react";
import Script from "next/script";

const AI_REFERRER_DOMAINS = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "gemini.google.com",
  "copilot.microsoft.com",
  "claude.ai",
];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalyticsTracker({ gaId }: { gaId?: string }) {
  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;
    const ref = document.referrer;
    if (!ref) return;

    try {
      const refHost = new URL(ref).hostname.toLowerCase();
      const matchedAi = AI_REFERRER_DOMAINS.find((domain) =>
        refHost.includes(domain)
      );
      if (matchedAi && typeof window.gtag === "function") {
        window.gtag("event", "ai_referral", {
          ai_source: matchedAi,
          referrer_url: ref,
          landing_page: window.location.pathname,
        });
      }
    } catch {
      // Ignore malformed referrer URL
    }
  }, [gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}

