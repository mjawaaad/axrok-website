"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand/Mark";
import { CtaLink } from "@/components/site/CtaLink";
import { Spotlight } from "@/components/ui/spotlight-new";
import { RevealGroup } from "@/components/motion/Reveal";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";
import { brand } from "@/content/site";
import frame1 from "@/assets/wolf/frame-1.webp";
import frame2 from "@/assets/wolf/frame-2.webp";
import frame3 from "@/assets/wolf/frame-3.webp";
import { WOLF, story } from "./story-state";
import { LZ_HOMES, frameAt } from "./zoom";

const WolfCanvas = dynamic(() => import("./WolfCanvas"), { ssr: false });
const GRADED_FRAMES = [frame1, frame2, frame3];

// [PLACEHOLDER] story copy drafted for the brief's four beats; refine with the brand team.
const BEATS = {
  one: { eyebrow: "Somewhere beyond your perimeter", line: "Something is already watching. It is patient, and it is learning." },
  two: { eyebrow: "Closer than you think", line: "Every gap you have not found brings it one step closer." },
  three: { eyebrow: "Readiness", line: "We hunt the way it hunts, so you see it first." },
};

function BeatCopy({ id, eyebrow, line, className = "" }: { id: string; eyebrow: string; line: string; className?: string }) {
  return (
    <div data-beat={id} className={`pointer-events-none absolute inset-x-0 opacity-0 ${className}`}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p data-beat-eyebrow className="eyebrow">
          {eyebrow}
        </p>
        <p data-beat-line className="display mt-5 max-w-[19ch] text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.03]">
          {line}
        </p>
      </div>
    </div>
  );
}

// Soft-edged window for a frame that is still smaller than the screen; --f is the feather.
const FEATHER_MASK =
  "linear-gradient(to right, transparent, #000 var(--f), #000 calc(100% - var(--f)), transparent), linear-gradient(to bottom, transparent, #000 var(--f), #000 calc(100% - var(--f)), transparent)";

/**
 * Image version of the push-in (phones, low-power devices, and the poster under the WebGL
 * scene): the three pre-graded frames layered and moved by the same zoom maths as the shader.
 */
function LiteVisual({ hidden }: { hidden: boolean }) {
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const shade = useRef<HTMLDivElement>(null);
  const vignette = useRef<HTMLDivElement>(null);
  const glints = useRef<(HTMLSpanElement | null)[]>([]);
  const set = useApp((s) => s.set);

  useEffect(() => {
    const apply = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const f = frameAt(story.lz, vw, vh);
      f.layers.forEach((l, i) => {
        const el = layers.current[i];
        if (!el) return;
        el.style.visibility = l.visible ? "visible" : "hidden";
        if (!l.visible) return;
        el.style.width = `${l.w}px`;
        el.style.height = `${l.h}px`;
        el.style.transform = `translate3d(${l.x}px, ${l.y}px, 0)`;
        el.style.opacity = String(l.alpha);
        const masked = l.feather > 0.001;
        el.style.setProperty("--f", `${(l.feather * 100).toFixed(2)}%`);
        el.style.maskImage = masked ? FEATHER_MASK : "none";
        el.style.webkitMaskImage = masked ? FEATHER_MASK : "none";
      });
      if (vignette.current) {
        vignette.current.style.background = `radial-gradient(circle at ${f.anchor[0]}px ${f.anchor[1]}px, transparent 18%, rgba(2,0,9,0.6) 75%)`;
      }
      if (shade.current) {
        // Maps the shader's exposure onto an overlay: beat 1 stays near-dark, beat 3 is fully lit.
        const light = Math.min(1, Math.max(0, (story.exposure * story.reveal - 0.45) / 0.5));
        shade.current.style.opacity = String(Math.min(1, 1 - light * 0.95 + story.fade));
      }
      const top = f.layers[2];
      glints.current.forEach((g, i) => {
        if (!g) return;
        g.style.opacity = String(story.eyes * (1 - story.fade));
        g.style.transform = `translate3d(${top.x + WOLF.eyes[i][0] * top.w}px, ${top.y + WOLF.eyes[i][1] * top.h}px, 0) translate(-50%, -50%)`;
        g.style.width = g.style.height = `${Math.max(3, top.w * 0.005)}px`;
      });
    };
    gsap.ticker.add(apply);
    return () => gsap.ticker.remove(apply);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${hidden ? "opacity-0" : "opacity-100"}`}>
      {GRADED_FRAMES.map((src, i) => (
        <div
          key={i}
          ref={(el) => {
            layers.current[i] = el;
          }}
          className="absolute top-0 left-0 will-change-transform [mask-composite:intersect] [-webkit-mask-composite:source-in]"
          style={{ visibility: i === 0 ? "visible" : "hidden" }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 220vw, 100vw"
            onLoad={i === 0 ? () => set({ assetProgress: 1, sceneReady: true }) : undefined}
            className="object-cover"
          />
        </div>
      ))}
      {WOLF.eyes.map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            glints.current[i] = el;
          }}
          aria-hidden
          className="absolute top-0 left-0 rounded-full bg-[#dfe5ff] opacity-0 shadow-[0_0_3px_1px_#5b70ff,0_0_12px_4px_rgba(30,58,255,0.45)]"
        />
      ))}
      <div ref={vignette} aria-hidden className="absolute inset-0" />
      <div ref={shade} aria-hidden className="absolute inset-0 bg-[#020009]" />
    </div>
  );
}

/** Reduced motion: the same story as static frames with simple fades. No pin, no scrub. */
function StoryStatic() {
  return (
    <section aria-labelledby="hero-title">
      <div className="relative flex min-h-svh items-end overflow-hidden">
        <Image src={frame1} alt={WOLF.alt} fill priority sizes="100vw" className="object-cover object-[70%_45%]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#020009] via-[#020009]/60 to-[#020009]/20" />
        <RevealGroup immediate className="relative mx-auto w-full max-w-[1440px] px-5 pb-20 md:px-10">
          {[BEATS.one, BEATS.two].map((b) => (
            <div key={b.eyebrow} data-reveal className="mt-10">
              <p className="eyebrow">{b.eyebrow}</p>
              <p className="display mt-4 max-w-[22ch] text-[clamp(1.8rem,3.8vw,3.4rem)] leading-[1.05]">{b.line}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
      <div className="relative grid min-h-[80svh] items-center overflow-hidden md:grid-cols-2">
        <div className="relative h-[60svh] md:h-full">
          <Image src={frame3} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[55%_35%]" />
        </div>
        <RevealGroup className="px-5 py-16 md:px-12">
          <p data-reveal className="eyebrow">
            {BEATS.three.eyebrow}
          </p>
          <p data-reveal className="display mt-4 max-w-[18ch] text-[clamp(1.8rem,3.8vw,3.4rem)] leading-[1.05]">
            {BEATS.three.line}
          </p>
        </RevealGroup>
      </div>
      <RevealGroup className="mx-auto flex min-h-[80svh] max-w-[1440px] flex-col items-center justify-center px-5 py-24 text-center md:px-10">
        <div data-reveal>
          <Mark title="Axrok" className="mx-auto h-24 w-auto text-cobalt-lift" />
        </div>
        <h1 data-reveal id="hero-title" className="display mt-10 text-[clamp(2.6rem,7vw,7rem)] leading-[0.94]">
          {brand.tagline}
        </h1>
        <p data-reveal className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
          {brand.positioning}
        </p>
        <div data-reveal className="mt-10">
          <CtaLink href="/contact">Request an Assessment</CtaLink>
        </div>
      </RevealGroup>
    </section>
  );
}

/** The pinned, scroll-scrubbed story: WebGL on capable devices, the light image version elsewhere. */
function StoryPinned() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const quality = useApp((s) => s.quality);
  const introDone = useApp((s) => s.introDone);
  const [mountCanvas, setMountCanvas] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [active, setActive] = useState(true);
  const onCanvasReady = useCallback(() => setCanvasReady(true), []);
  const webgl = quality === "high";

  // Defer the WebGL chunk until the browser is idle; the graded still holds the frame meanwhile.
  useEffect(() => {
    if (!webgl) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setMountCanvas(true), { timeout: 800 });
    else setTimeout(() => setMountCanvas(true), 200);
  }, [webgl]);


  // Only render WebGL while the story is on screen.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!quality) return;
      const q = gsap.utils.selector(stage);
      const LINES = "[data-beat-line], [data-hero-title]";
      const splitOf = new Map<Element, SplitText>();
      for (const el of q(LINES)) splitOf.set(el, SplitText.create(el, { type: "words,lines", mask: "lines", linesClass: "split-line" }));
      const splits = [...splitOf.values()];
      // Words of the split headline inside (or at) the matched element.
      const words = (sel: string) =>
        q(sel).flatMap((el) => {
          const target = el.matches(LINES) ? el : el.querySelector(LINES);
          return target ? (splitOf.get(target)?.words ?? []) : [];
        });

      // Opening state: distant, still, near-dark.
      Object.assign(story, { lz: 0, exposure: 0.95, parallax: 0.006, rim: 0.25, eyes: 0, fade: 0 });
      gsap.set(q("[data-beat]"), { autoAlpha: 0 });
      gsap.set(q("[data-beat='four']"), { autoAlpha: 1 });
      gsap.set(q("[data-four-item]"), { autoAlpha: 0, y: 24 });
      gsap.set(q("[data-four-mark]"), { autoAlpha: 0, scale: 1.25, filter: "blur(18px)" });
      gsap.set(words("[data-hero-title]"), { yPercent: 115 });
      gsap.set(q("[data-glow]"), { autoAlpha: 0, scale: 0.2 });
      gsap.set(q("[data-spot]"), { autoAlpha: 0 });

      // Beat 1 plays on arrival, not on scroll: the wolf rises out of darkness, then the first line.
      if (introDone) {
        gsap.fromTo(story, { reveal: 0 }, { reveal: 1, duration: 3.2, ease: "power2.out" });
        gsap.set(q("[data-beat='one']"), { autoAlpha: 1 });
        gsap.from(q("[data-beat='one'] [data-beat-eyebrow]"), { autoAlpha: 0, y: 12, duration: 1, delay: 0.6, ease: "power3.out" });
        gsap.from(words("[data-beat='one']"), { yPercent: 115, duration: 1.3, stagger: 0.05, delay: 0.8, ease: "expo.out" });
        gsap.from(q("[data-cue]"), { autoAlpha: 0, duration: 1, delay: 1.8 });
      } else {
        story.reveal = 0;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: section.current, start: "top top", end: "+=460%", pin: stage.current, scrub: 1.2, anticipatePin: 1 },
      });

      // The push-in: one continuous velocity curve in log-zoom, so it never jumps or stalls.
      // Ease in from rest, hold a constant speed through all three frames, then decelerate. Each
      // phase hands over at the same speed (quad ease covers half the distance a linear one would).
      const V = 0.36; // log-zoom per timeline second
      const ACCEL = 1;
      const lzHome3 = LZ_HOMES[2];
      const tHome3 = ACCEL + (lzHome3 - (V * ACCEL) / 2) / V;
      const DRIFT = 0.22; // continues past the closest frame's framing while slowing to rest
      tl.fromTo(story, { lz: 0 }, { lz: (V * ACCEL) / 2, duration: ACCEL, ease: "power1.in" }, 0);
      tl.to(story, { lz: lzHome3, duration: tHome3 - ACCEL }, ACCEL);
      tl.to(story, { lz: lzHome3 + DRIFT, duration: (2 * DRIFT) / V, ease: "power1.out" }, tHome3);
      const lineIn = (sel: string, at: number) => {
        tl.set(q(`[data-beat='${sel}']`), { autoAlpha: 1 }, at);
        tl.fromTo(q(`[data-beat='${sel}'] [data-beat-eyebrow]`), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, at);
        tl.fromTo(words(`[data-beat='${sel}']`), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" }, at + 0.1);
      };
      const lineOut = (sel: string, at: number) => tl.to(q(`[data-beat='${sel}']`), { autoAlpha: 0, y: -30, duration: 0.6, ease: "power2.in" }, at);

      // 1. Distant and still in near-darkness (copy already on screen).
      tl.to(q("[data-cue]"), { autoAlpha: 0, duration: 0.4 }, 0);
      tl.to(story, { exposure: 1.05, rim: 0.3, duration: 2.2, ease: "power1.inOut" }, 0);
      lineOut("one", 1.8);
      // 2. The viewpoint moves closer (frame 2 settles into its own framing around here).
      tl.to(story, { exposure: 1.2, rim: 0.45, duration: 2.4, ease: "power1.inOut" }, 2.2);
      lineIn("two", 2.6);
      lineOut("two", 4.5);
      // 3. Head-on: the closest frame fills the screen, cobalt rim light, eyes catch the light.
      tl.to(story, { exposure: 1.3, rim: 0.9, duration: 1.6, ease: "power1.inOut" }, 4.8);
      tl.to(story, { eyes: 1, duration: 0.9, ease: "power2.out" }, 6.1);
      lineIn("three", 5.6);
      lineOut("three", 7.3);
      // 4. The light in its eyes becomes the cobalt light the mark and tagline emerge from.
      tl.to(q("[data-glow]"), { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 7.5);
      tl.to(story, { fade: 1, duration: 1.6, ease: "power2.in" }, 7.6);
      tl.to(story, { lz: lzHome3 + DRIFT + 0.12, duration: 1.6, ease: "power2.in" }, 7.6);
      tl.to(q("[data-spot]"), { autoAlpha: 1, duration: 1.2 }, 8.1);
      tl.to(q("[data-four-mark]"), { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out" }, 8.3);
      tl.to(words("[data-hero-title]"), { yPercent: 0, duration: 1, stagger: 0.05, ease: "expo.out" }, 8.7);
      tl.to(q("[data-glow]"), { autoAlpha: 0.55, duration: 0.8 }, 9);
      tl.to(q("[data-four-item]"), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" }, 9.3);
      tl.to({}, { duration: 0.6 });

      return () => splits.forEach((s) => s.revert());
    },
    { scope: stage, dependencies: [quality, introDone], revertOnUpdate: true }
  );

  useEffect(() => ScrollTrigger.refresh(), [quality]);

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative">
      <div ref={stage} className="relative h-svh overflow-hidden bg-[#020009]">
        <div role="img" aria-label={WOLF.alt} className="absolute inset-0">
          <LiteVisual hidden={webgl && canvasReady} />
          {webgl && mountCanvas && (
            <div className={`absolute inset-0 transition-opacity duration-1000 ${canvasReady ? "opacity-100" : "opacity-0"}`}>
              {/* Cross-fade from the still once the live scene has drawn its first frames. */}
              <WolfCanvas active={active} onReady={onCanvasReady} />
            </div>
          )}
        </div>

        {/* Keeps the beat copy legible over bright fur. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#020009]/85 via-[#020009]/40 to-transparent" />

        {/* Beat 4 light: the eyes' glint widening into the cobalt field the mark emerges from. */}
        <div
          data-glow
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[140vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(30,58,255,0.5) 0%, rgba(30,58,255,0.16) 22%, rgba(11,1,57,0) 55%)" }}
        />
        <div data-spot aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
          <Spotlight
            gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(231, 100%, 72%, .10) 0, hsla(231, 100%, 56%, .03) 50%, hsla(231, 100%, 45%, 0) 80%)"
            gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(231, 100%, 72%, .07) 0, hsla(231, 100%, 56%, .02) 80%, transparent 100%)"
            gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(231, 100%, 72%, .05) 0, hsla(231, 100%, 45%, .02) 80%, transparent 100%)"
            duration={9}
            xOffset={60}
          />
        </div>

        <BeatCopy id="one" {...BEATS.one} className="bottom-[14svh]" />
        <BeatCopy id="two" {...BEATS.two} className="bottom-[14svh]" />
        <BeatCopy id="three" {...BEATS.three} className="bottom-[12svh]" />

        <div data-beat="four" className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <div data-four-mark>
            <Mark title="Axrok" className="h-20 w-auto text-cobalt-lift drop-shadow-[0_0_28px_rgba(30,58,255,0.55)] md:h-28" />
          </div>
          <h1 data-hero-title id="hero-title" className="display mt-10 text-[clamp(2.6rem,7.4vw,7.6rem)] leading-[0.94]">
            Precision Offense.{" "}
            <br />
            Absolute Defense.
          </h1>
          <p data-four-item className="mt-8 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {brand.positioning}
          </p>
          <div data-four-item className="mt-10">
            <CtaLink href="/contact">Request an Assessment</CtaLink>
          </div>
        </div>

        <div data-cue aria-hidden className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="font-mono text-[0.62rem] tracking-[0.3em] text-ink-dim uppercase">Scroll</span>
          <span className="block h-10 w-px origin-top animate-[cue_2.4s_ease-in-out_infinite] bg-gradient-to-b from-cobalt-lift to-transparent" />
        </div>
      </div>
    </section>
  );
}

/** Home's wolf story. The only interactive wolf on the site. */
export function WolfStory() {
  const reduced = useApp((s) => s.reducedMotion);
  return reduced ? <StoryStatic /> : <StoryPinned />;
}
