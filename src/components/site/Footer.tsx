import { Mark, Wordmark } from "@/components/brand/Mark";
import { brand, socials } from "@/content/site";

/** Shared footer: company, base, social profiles. No secondary navigation, no 3D. */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-navy-deep">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:py-16">
        <div className="flex items-start gap-4">
          <Mark title={null} className="h-10 w-auto shrink-0 text-cobalt-lift" />
          <div>
            <Wordmark className="text-sm text-ink" />
            <p className="mt-3 text-sm text-ink-muted">{brand.legalName}</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">Base</p>
          <p className="mt-3 text-sm text-ink-muted">
            {brand.city}
            <br />
            {brand.location}
          </p>
        </div>

        <div>
          <p className="eyebrow" id="footer-social">
            Social
          </p>
          {/* [PLACEHOLDER] profile URLs live in src/content/site.ts */}
          <ul aria-labelledby="footer-social" className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-ink hover:decoration-cobalt-lift"
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <div className="hairline" />
        <p className="mt-6 text-xs text-ink-dim">
          © {new Date().getFullYear()} {brand.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
