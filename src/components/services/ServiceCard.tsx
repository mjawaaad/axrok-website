import { CtaLink, LineLink } from "@/components/site/CtaLink";
import { MagicCard } from "@/components/ui/magic-card";
import type { Service } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * A service in the catalog. Magic UI's MagicCard gives a faint cobalt spotlight that follows
 * the cursor, never a fill. Two exits: the detail page, and Contact with the service pre-selected.
 */
export function ServiceCard({ service: s, compact = false, headingLevel = "h3" }: { service: Service; compact?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <MagicCard
      gradientSize={320}
      gradientColor="#1e3aff"
      gradientOpacity={0.14}
      gradientFrom="#5b70ff"
      gradientTo="#1e3aff"
      className={cn("h-full rounded-none", s.premium && "[--color-border:rgb(91_112_255/0.35)]")}
    >
      <article aria-labelledby={`${s.key}-title`} className="flex h-full flex-col p-7 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow">{s.index}</span>
          {s.premium && (
            <span className="border border-periwinkle/40 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.22em] text-periwinkle uppercase">
              Premium, with partner
            </span>
          )}
        </div>
        <Heading id={`${s.key}-title`} className="display mt-8 text-[1.5rem] leading-tight md:text-[1.65rem]">
          {s.title}
        </Heading>
        <p className="mt-4 leading-relaxed text-ink-muted">{compact ? s.short : s.description}</p>
        {!compact && (
          <ul aria-label={`${s.title} capabilities`} className="mt-6 flex flex-wrap gap-2">
            {s.capabilities.map((c) => (
              <li key={c} className="border border-line px-2.5 py-1 text-[0.78rem] text-ink-muted">
                {c}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-5 pt-9">
          <LineLink href={`/services/${s.slug}`} aria-label={`Learn more about ${s.title}`}>
            Learn more
          </LineLink>
          {!compact && (
            <CtaLink href={`/contact?service=${s.key}`} size="sm" aria-label={`Request ${s.title}`}>
              Request this service
            </CtaLink>
          )}
        </div>
      </article>
    </MagicCard>
  );
}
