"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  children: ReactNode;
  className?: string;
  /** "enter" animates on page entry (after the intro), "scroll" when it scrolls into view. */
  trigger?: "enter" | "scroll";
  delay?: number;
  id?: string;
};

/**
 * Headline that splits into words and rises line by line behind a mask.
 * Sharp expo easing only. Reduced motion gets a plain fade.
 */
export function SplitHeading({ as: Tag = "h2", children, className, trigger = "scroll", delay = 0, id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const introDone = useApp((s) => s.introDone);
  const reduced = useApp((s) => s.reducedMotion);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Hold the headline hidden until the intro hands over.
      if (!introDone) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      gsap.set(el, { autoAlpha: 1 });

      if (reduced) {
        gsap.from(el, {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
        });
        return;
      }

      const split = SplitText.create(el, {
        type: "lines,words",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 115,
            rotate: 2,
            duration: 1.25,
            ease: "expo.out",
            stagger: 0.045,
            delay,
            scrollTrigger:
              trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
          });
        },
      });
      return () => split.revert();
    },
    { dependencies: [introDone, reduced], scope: ref, revertOnUpdate: true }
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
