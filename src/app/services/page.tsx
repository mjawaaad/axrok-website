import type { Metadata } from "next";
import { CtaLink } from "@/components/site/CtaLink";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services, tiers } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "Services",
  description:
    "Penetration testing, managed security (SOC), GRC and compliance, threat intelligence and investigations, post-quantum security, and space and satellite security. Engagements scaled from Scout to Siege.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section aria-labelledby="services-title">
        <div className="mx-auto max-w-[1440px] px-5 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20">
          <p className="eyebrow">Services</p>
          <SplitHeading as="h1" id="services-title" trigger="enter" className="display mt-6 max-w-[14ch] text-[clamp(2.6rem,6.4vw,6.4rem)] leading-[0.95]">
            Six disciplines. One accountable partner.
          </SplitHeading>
          <RevealGroup immediate delay={0.5} className="mt-10 max-w-xl">
            {/* [PLACEHOLDER] intro paragraph drafted from the brief */}
            <p data-reveal className="text-lg leading-relaxed text-ink-muted">
              Offensive testing, managed defense, compliance, intelligence, post-quantum readiness and space-sector
              security. Engage one discipline or combine them into a single program, scoped to the risk you actually carry.
            </p>
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="catalog-title" className="pb-28 md:pb-40">
        <h2 id="catalog-title" className="sr-only">
          Service catalog
        </h2>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((s) => (
              <li key={s.key} id={s.key} data-reveal className="scroll-mt-28">
                <ServiceCard service={s} />
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="tiers-title" className="border-t border-line bg-navy-deep/60 py-28 md:py-40">
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
              Every engagement is scoped individually. The tiers describe how deep we go and how long we stay, not a fixed menu.
            </p>
          </div>

          <RevealGroup as="ol" className="mt-20 border-t border-line">
            {tiers.map((t, i) => (
              <li key={t.key} data-reveal className="grid gap-6 border-b border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
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

      <section aria-labelledby="services-close" className="py-28 md:py-36">
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
