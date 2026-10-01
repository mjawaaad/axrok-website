"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IntroMark } from "@/components/brand/IntroMark";
import { gsap, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";
import { INTRO_SESSION_KEY as SESSION_KEY } from "@/lib/intro";

// Measured from navigation start (performance.now()), not from hydration.
const MAX_MS = 2600; // never hold a visitor longer than this; a slow scene fades in when ready

/**
 * First-load intro, once per session. The Amarok mark assembles from shards (silhouette drawn
 * first) over a percentage loader while the 3D scene preloads behind it. The assembly is pure
 * CSS so it starts at first paint; this component takes over the live percentage and the exit.
 * A head script marks repeat visits (html[data-intro="skip"]) so the overlay never flashes.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const set = useApp((s) => s.set);

  // Repeat visit in this session: CSS already hides the overlay; just hand over.
  useEffect(() => {
    if (document.documentElement.dataset.intro === "skip") set({ introDone: true });
  }, [set]);

  useGSAP(
    () => {
      if (document.documentElement.dataset.intro === "skip" || !root.current) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.documentElement.style.overflow = "hidden";

      // Continue from wherever the CSS counter and bar have got to.
      const cssP = Number(getComputedStyle(counter.current!, "::before").getPropertyValue("--intro-p")) || 0;
      const shown = { p: Math.min(0.72, cssP / 100) };
      counter.current!.dataset.live = "";
      bar.current!.dataset.live = "";

      // The CSS assembly (shards, outline, seal, letters) must land before we leave.
      let assembled = reduced;
      const running = root.current
        .getAnimations({ subtree: true })
        .filter((a) => !(a as CSSAnimation).animationName?.startsWith("intro-count") && !(a as CSSAnimation).animationName?.startsWith("intro-bar"));
      Promise.all(running.map((a) => a.finished.catch(() => null))).then(() => (assembled = true));

      let fontsReady = false;
      document.fonts?.ready.then(() => (fontsReady = true));
      // Only Home carries heavy assets (the wolf story); every other page is ready once fonts are.
      const onHome = /^\/?$/.test(window.location.pathname.replace(process.env.NEXT_PUBLIC_BASE_PATH ?? "", ""));
      const target = () => {
        const s = useApp.getState();
        let p = fontsReady ? 0.12 : 0.04;
        if (s.quality) p += 0.08;
        if (!onHome) p += fontsReady ? 0.8 : 0.4;
        else p += s.assetProgress * 0.62 + (s.sceneReady ? 0.18 : 0);
        return Math.min(1, Math.max(p, shown.p, Math.min(0.95, performance.now() / MAX_MS)));
      };

      let leaving = false;
      const tick = () => {
        const t = target();
        shown.p += (t - shown.p) * 0.14;
        if (t >= 1 && shown.p > 0.99) shown.p = 1;
        counter.current!.textContent = String(Math.round(shown.p * 100)).padStart(3, "0");
        bar.current!.style.transform = `scaleX(${shown.p})`;
        const ready = shown.p >= 1 && assembled;
        if (!leaving && (ready || (assembled && performance.now() > MAX_MS))) {
          leaving = true;
          leave();
        }
      };
      gsap.ticker.add(tick);

      const leave = () => {
        gsap.ticker.remove(tick);
        counter.current!.textContent = "100";
        bar.current!.style.transform = "scaleX(1)";
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
        const tl = gsap.timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setGone(true);
          },
        });
        if (reduced) {
          tl.call(() => set({ introDone: true })).to(root.current, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
          return;
        }
        tl.to("[data-intro-meta]", { autoAlpha: 0, duration: 0.25, ease: "power2.in" })
          .to("[data-intro-mark]", { scale: 0.94, autoAlpha: 0, duration: 0.4, ease: "expo.in" }, "<")
          .call(() => set({ introDone: true }), undefined, "-=0.15")
          .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.75, ease: "expo.inOut" }, "-=0.1");
      };

      return () => {
        gsap.ticker.remove(tick);
        document.documentElement.style.overflow = "";
      };
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      id="intro"
      role="status"
      aria-live="polite"
      aria-label="Loading Axrok"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy [clip-path:inset(0%_0%_0%_0%)]"
    >
      <div data-intro-mark className="flex flex-col items-center">
        <IntroMark className="h-[min(30vh,15rem)] w-auto text-cobalt" />
        <div className="mt-10 flex overflow-hidden" aria-hidden>
          {"AXROK".split("").map((ch, i) => (
            <span
              key={i}
              className="intro-letter font-display text-[clamp(1.1rem,2.4vw,1.6rem)] font-semibold tracking-[0.5em] text-ink [font-stretch:125%]"
              style={{ animationDelay: `${0.55 + i * 0.06}s` } as CSSProperties}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      <div data-intro-meta className="absolute inset-x-5 bottom-8 flex items-end justify-between md:inset-x-10 md:bottom-10">
        <p className="eyebrow hidden text-ink-dim sm:block">Precision Offense. Absolute Defense.</p>
        <p className="ml-auto font-mono text-sm tracking-[0.2em] text-periwinkle tabular-nums">
          <span ref={counter} className="intro-counter" />
          <span className="text-ink-dim">%</span>
        </p>
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line">
        <span ref={bar} className="intro-bar block h-full origin-left scale-x-0 bg-cobalt-lift" />
      </span>
    </div>
  );
}
