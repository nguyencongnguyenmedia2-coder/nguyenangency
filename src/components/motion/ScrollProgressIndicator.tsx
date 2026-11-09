"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollProgressIndicator() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/Admin");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdminRoute) return;

    let rafId = 0;
    const updateProgress = () => {
      const bar = barRef.current;
      if (!bar) return;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = totalScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / totalScroll)) : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    const onScroll = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isAdminRoute, pathname]);

  if (isAdminRoute) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none bg-transparent">
      <div
        ref={barRef}
        style={{ transform: "scaleX(0)" }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#007BA7] via-[#FF2D95] to-[#38BDF8] shadow-[0_0_12px_rgba(255,45,149,0.65)] will-change-transform"
      />
    </div>
  );
}
