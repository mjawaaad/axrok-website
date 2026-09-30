"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";
import { brand } from "@/content/site";

/**
 * The positioning line, pinned over the scene while its words light up with scroll.
 * The wolf recedes and turns aside underneath (see HomeScenePath).
 */
export function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLHeadingElement>(null);
  const quality = useApp((s) => s.quality);
  const reduced = useApp((s) => s.reducedMotion);
  const introDone = useApp((s) => s.introDone);

  useGSAP(
    () => {
      if (!introDone || !line.current) return;
      if (reduced || quality !== "high") {
        gsap.from(section.current!.querySelectorAll("[data-fade]"), {
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section.current, start: "top 75%", once: true },
        });
        return;
      }
      const split = SplitText.create(line.current, { type: "words" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });
      tl.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.08, ease: "none", duration: 0.6 })
        .from("[data-after]", { autoAlpha: 0, y: 24, duration: 0.5, ease: "power3.out" }, ">-0.2")
        .to({}, { duration: 0.3 });
      return () => split.revert();
    },
    { dependencies: [introDone, reduced, quality], scope: section, revertOnUpdate: true }
  );

  return (
    <section
      ref={section}
      data-scene="manifesto"
      aria-labelledby="manifesto-title"
      className="relative flex min-h-dvh items-center"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow" data-fade>
          Positioning
        </p>
        <h2
          ref={line}
          id="manifesto-title"
          data-fade
          className="display mt-8 max-w-[22ch] text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.05]"
        >
          {brand.positioning}
        </h2>
        <div data-after data-fade className="mt-12 grid max-w-4xl gap-8 md:grid-cols-[auto_1fr] md:gap-14">
          <div className="hairline mt-3 hidden w-24 md:block" />
          {/* [PLACEHOLDER] supporting paragraph drafted from the brief */}
          <p className="text-lg leading-relaxed text-ink-muted">
            Offense shows you where you are exposed. Defense keeps watch once you know. Intelligence tells you who
            is looking. Axrok brings all three under one accountable partner, so what we learn in one discipline
            sharpens the others.
          </p>
        </div>
      </div>
    </section>
  );
}
