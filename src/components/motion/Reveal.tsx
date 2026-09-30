"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

/**
 * Staggers every descendant marked [data-reveal] into view as it scrolls in.
 * Reduced motion and static-quality devices get a short fade with no travel.
 */
export function RevealGroup({
  children,
  className,
  as: Tag = "div",
  immediate = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  /** Reveal on page entry instead of on scroll (for content above the fold). */
  immediate?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useApp((s) => s.reducedMotion);
  const quality = useApp((s) => s.quality);
  const introDone = useApp((s) => s.introDone);

  useGSAP(
    () => {
      if (!introDone) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      if (!items.length) return;
      const light = reduced || quality === "static";
      gsap.set(items, { autoAlpha: 0, y: light ? 0 : 28 });
      if (immediate) {
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          delay,
          duration: light ? 0.6 : 1.1,
          ease: light ? "power2.out" : "expo.out",
          stagger: 0.1,
        });
        return;
      }
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: light ? 0.6 : 1.1,
            ease: light ? "power2.out" : "expo.out",
            stagger: light ? 0.04 : 0.09,
            overwrite: true,
          }),
      });
    },
    { dependencies: [introDone, reduced, quality, immediate, delay], scope: ref, revertOnUpdate: true }
  );

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
