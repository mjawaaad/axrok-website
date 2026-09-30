"use client";

import { useId, useRef } from "react";
import { geometry, shards } from "./shards";
import { gsap, useGSAP } from "@/lib/gsap";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  title?: string;
};

/**
 * The Axrok mark cut into machined shards that assemble when scrolled into view (About).
 * Each shard is the logo clipped to one triangle, so moving a shard moves its slice of the
 * mark. A faint outline of the wolf's silhouette draws first, so the fragments read as a wolf
 * before they read as a logo. Reduced motion shows the finished mark.
 */
export function ShardMark({ className, title = "Axrok" }: Props) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<SVGSVGElement>(null);
  const reduced = useApp((s) => s.reducedMotion);

  useGSAP(
    () => {
      const svg = root.current!;
      const els = gsap.utils.toArray<SVGGElement>("[data-shard]", svg);
      const outline = svg.querySelector<SVGPathElement>("[data-outline]")!;
      const solid = svg.querySelector<SVGPathElement>("[data-solid]")!;
      if (reduced) {
        gsap.set(solid, { opacity: 1 });
        return;
      }

      els.forEach((el, i) => {
        const s = shards[i];
        gsap.set(el, { x: s.tx, y: s.ty, rotate: s.r, scale: 0.86, opacity: 0, svgOrigin: `${s.cx} ${s.cy}` });
      });

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(outline, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power3.inOut" })
        .to(
          els,
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 1.25,
            ease: "expo.out",
            stagger: { each: 0.6 / els.length, from: "center", grid: "auto" },
          },
          0.35
        )
        .to(outline, { opacity: 0, duration: 0.7, ease: "power2.out" }, ">-0.3")
        // Seal the seams: the unbroken mark settles over the shards.
        .to(solid, { opacity: 1, duration: 0.5, ease: "power2.out" }, "<");

      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            tl.play();
            io.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(svg);
      return () => io.disconnect();
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true }
  );

  return (
    <svg ref={root} viewBox={geometry.viewBox.join(" ")} role="img" aria-label={title} className={cn("overflow-visible", className)}>
      <defs>
        {shards.map((s, i) => (
          <clipPath key={i} id={`${uid}-s${i}`} clipPathUnits="userSpaceOnUse">
            <polygon points={s.points} />
          </clipPath>
        ))}
      </defs>
      <path
        data-outline
        d={geometry.silhouette}
        pathLength={1}
        strokeDasharray={1}
        fill="none"
        stroke="var(--color-cobalt-lift)"
        strokeWidth={2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ opacity: 0 }}
      />
      {shards.map((s, i) => (
        // Hidden in server HTML so the finished mark never flashes before it assembles.
        <g key={i} data-shard clipPath={`url(#${uid}-s${i})`} style={{ opacity: 0 }}>
          <path d={geometry.path} fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth={0.8} />
        </g>
      ))}
      <path data-solid d={geometry.path} fill="currentColor" fillRule="evenodd" style={{ opacity: 0 }} />
    </svg>
  );
}
