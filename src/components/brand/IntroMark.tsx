import type { CSSProperties } from "react";
import { geometry, shards } from "./shards";

/**
 * The intro's assembling mark, driven entirely by CSS (see .intro-* in globals.css) so it
 * starts at first paint rather than after hydration. The wolf's silhouette draws first,
 * the shards fly home from the center out, then the unbroken mark seals the seams.
 */
export function IntroMark({ className }: { className?: string }) {
  return (
    <svg viewBox={geometry.viewBox.join(" ")} role="img" aria-label="Axrok" className={`overflow-visible ${className ?? ""}`}>
      <defs>
        {shards.map((s, i) => (
          <clipPath key={i} id={`intro-s${i}`} clipPathUnits="userSpaceOnUse">
            <polygon points={s.points} />
          </clipPath>
        ))}
      </defs>
      <path
        className="intro-outline"
        d={geometry.silhouette}
        pathLength={1}
        fill="none"
        stroke="var(--color-cobalt-lift)"
        strokeWidth={2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {shards.map((s, i) => (
        <g
          key={i}
          className="intro-shard"
          clipPath={`url(#intro-s${i})`}
          style={
            {
              "--tx": `${s.tx.toFixed(1)}px`,
              "--ty": `${s.ty.toFixed(1)}px`,
              "--r": `${s.r}deg`,
              transformOrigin: `${s.cx}px ${s.cy}px`,
              animationDelay: `${(0.25 + s.dist * 0.4).toFixed(3)}s`,
            } as CSSProperties
          }
        >
          <path d={geometry.path} fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth={0.8} />
        </g>
      ))}
      <path className="intro-solid" d={geometry.path} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
