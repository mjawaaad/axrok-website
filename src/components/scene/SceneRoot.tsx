"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";
import { detectCapability, prefersReducedMotion } from "@/lib/capability";
import { ROUTE_POSES, STILL_POSES, pose, resetScrollPose, routeKeyFor, scrollPose, stillMode } from "@/lib/scene-state";
import { StaticWolf } from "./StaticWolf";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

/** Falls back to the static render if WebGL throws (context loss, driver bugs). */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Mounted once in the root layout, so the wolf and the light rig persist across routes.
 * Each route has a target pose; route changes tween the live pose toward it.
 */
export function SceneRoot() {
  const pathname = usePathname();
  const quality = useApp((s) => s.quality);
  const reduced = useApp((s) => s.reducedMotion);
  const introDone = useApp((s) => s.introDone);
  const sceneReady = useApp((s) => s.sceneReady);
  const set = useApp((s) => s.set);
  const [mountCanvas, setMountCanvas] = useState(false);
  const firstRoute = useRef(true);
  const fadeRef = useRef<HTMLDivElement>(null);

  // Detect capability after hydration, then defer the heavy canvas chunk until the browser is idle.
  useEffect(() => {
    const cap = detectCapability();
    const reducedMotion = prefersReducedMotion();
    set({ quality: cap.quality, reducedMotion });
    document.documentElement.dataset.quality = cap.quality;
    if (cap.quality !== "high") return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setMountCanvas(true), { timeout: 600 });
    else setTimeout(() => setMountCanvas(true), 150);
  }, [set]);

  // Route choreography.
  useEffect(() => {
    const still = stillMode();
    if (still) {
      Object.assign(pose, STILL_POSES[still]);
      return;
    }
    const target = ROUTE_POSES[routeKeyFor(pathname)];
    if (firstRoute.current) {
      firstRoute.current = false;
      // First paint: hold the camera back so the intro can dolly in.
      Object.assign(pose, target, { camZ: reduced ? target.camZ : target.camZ + 4 });
      return;
    }
    gsap.killTweensOf(pose);
    gsap.killTweensOf(scrollPose);
    if (reduced) {
      // No camera travel: a quick crossfade hides the change of pose.
      const veil = fadeRef.current;
      gsap
        .timeline()
        .to(veil, { opacity: 0, duration: 0.25, ease: "power1.out" })
        .call(() => {
          resetScrollPose();
          Object.assign(pose, target);
        })
        .to(veil, { opacity: 1, duration: 0.35, ease: "power1.in" });
      return;
    }
    const zero = Object.fromEntries(Object.keys(scrollPose).map((k) => [k, 0]));
    gsap.to(scrollPose, { ...zero, duration: 1.4, ease: "expo.inOut" });
    gsap.to(pose, { ...target, duration: 1.8, ease: "expo.inOut" });
  }, [pathname, reduced]);

  // Reduced motion and the static fallback have no scroll choreography, so keep text legible by
  // dimming the scene once the visitor scrolls past the first screen. A fade, not movement.
  useEffect(() => {
    if (!reduced && quality !== "static") return;
    const el = fadeRef.current?.parentElement;
    if (!el) return;
    let dimmed = false;
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.5;
      if (next === dimmed) return;
      dimmed = next;
      gsap.to(fadeRef.current, { opacity: next ? 0.22 : 1, duration: 0.5, ease: "power1.out", overwrite: true });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, quality, pathname]);

  // Dolly in once the intro hands over.
  useEffect(() => {
    if (!introDone || stillMode()) return;
    const target = ROUTE_POSES[routeKeyFor(window.location.pathname)];
    gsap.to(pose, { camZ: target.camZ, duration: reduced ? 0 : 2.6, ease: "expo.out" });
  }, [introDone, reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
      style={{ opacity: quality === "high" ? (sceneReady ? 1 : 0) : 1 }}
    >
      <div ref={fadeRef} className="absolute inset-0">
        {quality === "high" && mountCanvas && (
          <SceneBoundary onError={() => set({ quality: "static" })}>
            <SceneCanvas />
          </SceneBoundary>
        )}
        {quality === "static" && <StaticWolf />}
      </div>
    </div>
  );
}
