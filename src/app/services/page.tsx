import type { Metadata } from "next";
import { CtaLink } from "@/components/site/CtaLink";
import { Corners } from "@/components/site/Corners";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { services, tiers } from "@/content/site";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "Services",
  description:
    "Penetration testing, managed security (SOC), GRC and compliance, cyber threat intelligence and investigations, and post-quantum security. Engagements scaled from Scout to Siege.",
  path: "/services",
});


export default function ServicesPage() {
  return (
    <>
      <section data-scene="intro" aria-labelledby="services-title" className="relative">
        <div className="mx-auto max-w-[1440px] px-5 pt-36 pb-16 md:px-10 md:pt-48 md:pb-24">
          <p className="eyebrow">Services</p>
          <SplitHeading
            as="h1"
            id="services-title"
            trigger="enter"
            className="display mt-6 max-w-[14ch] text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[0.95]"
          >
            Five disciplines. One accountable partner.
          </SplitHeading>
          <RevealGroup immediate delay={0.5} className="mt-10 max-w-xl">
            {/* [PLACEHOLDER] intro paragraph drafted from the brief */}
            <p data-reveal className="text-lg leading-relaxed text-ink-muted">
              Offensive testing, managed defense, compliance, intelligence and post-quantum readiness. Engage one
              discipline or combine them into a single program, scoped to the risk you actually carry.
            </p>
          </RevealGroup>
        </div>
      </section>

      <section data-scene="catalog" aria-labelledby="catalog-title" className="relative pb-28 md:pb-40">
        <h2 id="catalog-title" className="sr-only">
          Service catalog
        </h2>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 lg:w-[66%]">
            {services.map((s) => (
              <li
                key={s.key}
                id={s.key}
                data-reveal
                className={cn("scroll-mt-28", s.premium && "md:col-span-2")}
              >
                <article
                  aria-labelledby={`${s.key}-title`}
                  className={cn(
                    "group/card relative flex h-full flex-col border border-line bg-navy/60 p-7 backdrop-blur-md transition-colors duration-500 hover:border-cobalt-lift/45 md:p-9",
                    s.premium && "border-cobalt-lift/30 bg-navy-raised/60"
                  )}
                >
                  <Corners />
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow">{s.index}</span>
                    {s.premium && (
                      <span className="border border-periwinkle/40 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.22em] text-periwinkle uppercase">
                        Premium, with partner
                      </span>
                    )}
                  </div>
                  <h3 id={`${s.key}-title`} className="display mt-8 text-[1.6rem] leading-tight md:text-[1.85rem]">
                    {s.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-ink-muted">{s.description}</p>
                  <ul aria-label={`${s.title} capabilities`} className="mt-7 flex flex-wrap gap-2">
                    {s.capabilities.map((c) => (
                      <li key={c} className="border border-line px-3 py-1.5 text-[0.8rem] text-ink-muted">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-9">
                    <CtaLink href={`/contact?service=${s.key}`} size="sm" aria-label={`Request ${s.title}`}>
                      Request this service
                    </CtaLink>
                  </div>
                </article>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section data-scene="tiers" aria-labelledby="tiers-title" className="relative border-t border-line bg-navy/70 py-28 backdrop-blur-sm md:py-40">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow">Engagement tiers</p>
              <SplitHeading id="tiers-title" className="display mt-6 text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.02]">
                Scaled to where you are.
              </SplitHeading>
            </div>
            <p className="self-end text-lg leading-relaxed text-ink-muted lg:col-span-6 lg:col-start-7">
              {/* [PLACEHOLDER] tier intro drafted */}
              Every engagement is scoped individually. The tiers describe how deep we go and how long we stay, not a
              fixed menu.
            </p>
          </div>

          <RevealGroup as="ol" className="mt-20 border-t border-line">
            {tiers.map((t, i) => (
              <li
                key={t.key}
                data-reveal
                className="grid gap-6 border-b border-line py-12 md:grid-cols-12 md:gap-10 md:py-16"
              >
                <div className="md:col-span-4">
                  <span className="eyebrow">Tier 0{i + 1}</span>
                  <h3 className="display mt-4 text-5xl md:text-6xl">{t.name}</h3>
                  <p className="mt-3 text-sm tracking-[0.08em] text-periwinkle uppercase">{t.audience}</p>
                </div>
                <div className="flex flex-col gap-8 md:col-span-7 md:col-start-6">
                  <p className="text-lg leading-relaxed text-ink-muted">{t.narrative}</p>
                  <div>
                    <CtaLink href={`/contact?tier=${t.key}`} size="sm">
                      {t.cta}
                    </CtaLink>
                  </div>
                </div>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section data-scene="close" aria-labelledby="services-close" className="relative py-28 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SplitHeading id="services-close" className="display max-w-[18ch] text-[clamp(2.2rem,5vw,4.8rem)] leading-[1]">
            Not sure which service fits?
          </SplitHeading>
          <RevealGroup className="mt-10 flex flex-wrap items-center gap-8">
            <p data-reveal className="max-w-md text-ink-muted">
              Describe the problem. We will recommend the right starting point, even if it is a small one.
            </p>
            <div data-reveal>
              <CtaLink href="/contact?service=unsure">Talk to Axrok</CtaLink>
            </div>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
