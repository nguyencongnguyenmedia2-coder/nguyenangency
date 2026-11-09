"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/Admin");

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Ensure ScrollTrigger calculates positions accurately after initial layout
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [isAdminRoute]);

  // Refresh ScrollTrigger when navigating between public pages
  useEffect(() => {
    if (!isAdminRoute) {
      window.scrollTo(0, 0);
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [pathname, isAdminRoute]);

  return <>{children}</>;
}
