"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/Admin");

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isAdminRoute || typeof window === "undefined") {
      setEnabled(false);
      return;
    }

    const mediaQuery = window.matchMedia("(pointer: fine)");
    setEnabled(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isAdminRoute]);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;
    let visible = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        ringX = mouseX;
        ringY = mouseY;
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor-hover]"
      );
      setIsHovered(Boolean(interactive));
    };

    const onMouseLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const renderLoop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      rafId = window.requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled || isAdminRoute) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#FF2D95] transition-[width,height,background-color,opacity] duration-200 will-change-transform ${
          isHovered ? "w-2.5 h-2.5 bg-white shadow-[0_0_12px_#FFFFFF]" : "w-1.5 h-1.5"
        }`}
      />
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border transition-[width,height,border-color,background-color,opacity] duration-200 will-change-transform ${
          isHovered
            ? "w-12 h-12 border-[#FF2D95]/70 bg-[#FF2D95]/10"
            : "w-8 h-8 border-[#007BA7]/45 bg-transparent"
        }`}
      />
    </>
  );
}
