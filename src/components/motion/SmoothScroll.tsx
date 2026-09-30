"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger and Lenis stay in lockstep. */
export function SmoothScroll() {
  const reduced = useApp((s) => s.reducedMotion);
  const introDone = useApp((s) => s.introDone);
  const pathname = usePathname();
  const first = useRef(true);

  // Hold scroll while the intro plays.
  useEffect(() => {
    if (introDone) lenisInstance?.start();
    else lenisInstance?.stop();
  }, [introDone, reduced]);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(2, -10 * t), autoRaf: false });
    lenisInstance = lenis;
    if (!useApp.getState().introDone) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);

  // New route: start at the top and let triggers re-measure the new page.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
