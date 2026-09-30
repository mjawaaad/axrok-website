import { Mark, Wordmark } from "@/components/brand/Mark";
import { brand } from "@/content/site";
import { cn } from "@/lib/utils";

/** The fully formed mark as a quiet closing signature (About and Contact). */
export function Signature({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <Mark title="Axrok mark" className={cn("w-auto text-cobalt-lift", compact ? "h-10" : "h-14")} />
      <div className="border-l border-line pl-5">
        <Wordmark className="text-sm text-ink" />
        <p className="mt-1.5 text-xs text-ink-dim">{brand.tagline}</p>
      </div>
    </div>
  );
}
