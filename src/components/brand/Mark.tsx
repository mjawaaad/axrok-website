import type { SVGProps } from "react";
import geometry from "@/content/logo-geometry.json";

const VIEWBOX = geometry.viewBox.join(" ");

/** The Axrok Amarok mark, traced from the brand artwork. Inherits color from `currentColor`. */
export function Mark({ title = "Axrok", ...props }: SVGProps<SVGSVGElement> & { title?: string | null }) {
  return (
    <svg
      viewBox={VIEWBOX}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ?? undefined}
      {...props}
    >
      <path d={geometry.path} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Wordmark set in the display face. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-semibold tracking-[0.34em] [font-stretch:125%] ${className}`}>
      AXROK
    </span>
  );
}
