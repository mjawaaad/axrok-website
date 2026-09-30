import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CtaLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: string;
  size?: "sm" | "md";
};

/**
 * The only call to action on the site. Every instance routes to /contact.
 * Hover: the outline sharpens, an underline draws in and the arrow picks up the ember accent.
 * Never a color fill.
 */
export function CtaLink({ children, className, size = "md", ...props }: CtaLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group/cta relative inline-flex items-center gap-3 border border-cobalt-lift/55 bg-navy/30 text-ink backdrop-blur-sm",
        "transition-[border-color,box-shadow] duration-500 ease-[var(--ease-expo-out)]",
        "hover:border-cobalt-lift hover:shadow-[inset_0_0_0_1px_var(--color-cobalt-lift)]",
        "focus-visible:border-cobalt-lift",
        size === "md" ? "px-6 py-3.5 text-[0.8rem]" : "px-4 py-2 text-[0.72rem]",
        "font-medium tracking-[0.14em] uppercase",
        className
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-cobalt-lift transition-transform duration-500 ease-[var(--ease-expo-out)] group-hover/cta:scale-x-100"
        />
      </span>
      <Arrow />
    </Link>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn(
        "size-3.5 text-periwinkle transition-[transform,color] duration-500 ease-[var(--ease-expo-out)] group-hover/cta:translate-x-1 group-hover/cta:text-ember",
        className
      )}
    >
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Quiet text link with the same underline behaviour, for secondary routes (e.g. "All services"). */
export function LineLink({ children, className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "group/cta inline-flex items-center gap-2 text-sm font-medium tracking-[0.08em] text-periwinkle uppercase",
        className
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-periwinkle/40 transition-transform duration-500 ease-[var(--ease-expo-out)] group-hover/cta:origin-left group-hover/cta:bg-cobalt-lift"
        />
      </span>
      <Arrow />
    </Link>
  );
}
