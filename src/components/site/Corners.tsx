import { cn } from "@/lib/utils";

/** Machined corner ticks; they extend on hover of the nearest `group/card`. */
export function Corners({ className }: { className?: string }) {
  const tick =
    "absolute size-3 border-cobalt-lift/70 transition-all duration-500 ease-[var(--ease-expo-out)] group-hover/card:size-5 group-hover/card:border-cobalt-lift";
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(tick, "top-0 left-0 border-t border-l")} />
      <span className={cn(tick, "top-0 right-0 border-t border-r")} />
      <span className={cn(tick, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(tick, "right-0 bottom-0 border-r border-b")} />
    </span>
  );
}
