"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";
import { resetScrollPose, scrollPose } from "@/lib/scene-state";

export type SceneOffset = Partial<typeof scrollPose>;

const KEYS = Object.keys(scrollPose) as (keyof typeof scrollPose)[];
const full = (o: SceneOffset) => Object.fromEntries(KEYS.map((k) => [k, o[k] ?? 0])) as typeof scrollPose;

/**
 * Scroll choreography for the persistent wolf within one page. Each [data-scene] section blends
 * the wolf toward path[scene] as the section's top travels from the viewport bottom to 35%.
 * Offsets add to the route pose, so a route change simply tweens them back to zero.
 * Render it last on the page so any pins above it exist before these triggers measure.
 */
export function ScenePath({ path }: { path: Record<string, SceneOffset> }) {
  const quality = useApp((s) => s.quality);
  const reduced = useApp((s) => s.reducedMotion);
  const introDone = useApp((s) => s.introDone);

  useGSAP(
    () => {
      if (quality !== "high" || reduced || !introDone) return;
      const pathname = window.location.pathname;
      const sections = gsap.utils.toArray<HTMLElement>("[data-scene]");
      const stops = sections.map((el) => full(path[el.dataset.scene ?? ""] ?? {}));
      const progress = sections.map(() => 0);
      const ease = gsap.parseEase("power2.inOut");

      const apply = () => {
        const next = { ...stops[0] };
        for (let i = 1; i < stops.length; i++) {
          const p = ease(progress[i]);
          if (p === 0) continue;
          for (const k of KEYS) next[k] += (stops[i][k] - stops[i - 1][k]) * p;
        }
        Object.assign(scrollPose, next);
      };

      const triggers = sections.slice(1).map((el, j) => {
        const sync = (self: ScrollTrigger) => {
          progress[j + 1] = self.progress;
          apply();
        };
        return ScrollTrigger.create({ trigger: el, start: "top bottom", end: "top 35%", onUpdate: sync, onRefresh: sync });
      });

      return () => {
        triggers.forEach((t) => t.kill());
        // A route change tweens offsets back to zero; only snap when we stayed on this page (e.g. hot reload).
        if (window.location.pathname === pathname) resetScrollPose();
      };
    },
    { dependencies: [quality, reduced, introDone, path], revertOnUpdate: true }
  );

  return null;
}
