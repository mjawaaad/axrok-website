"use client";

import { useEffect } from "react";
import { useApp } from "@/lib/app-store";
import { detectCapability, prefersReducedMotion } from "@/lib/capability";

/** Detects device capability and motion preference once, after hydration. */
export function ClientInit() {
  const set = useApp((s) => s.set);
  useEffect(() => {
    const cap = detectCapability();
    document.documentElement.dataset.quality = cap.quality;
    set({ quality: cap.quality, reducedMotion: prefersReducedMotion() });
  }, [set]);
  return null;
}
