import { CtaLink, LineLink } from "@/components/site/CtaLink";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { differentiators, services } from "@/content/site";

const TEASER = ["pentest", "soc", "cti", "space"].map((k) => services.find((s) => s.key === k)!);

export function ServicesTeaser() {
  return (
    <section aria-labelledby="services-teaser-title" className="border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow">What we do</p>
            <SplitHeading id="services-teaser-title" className="display mt-6 max-w-[16ch] text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.02]">
              One partner across offense, defense and intelligence.
            </SplitHeading>
          </div>
          <LineLink href="/services">All six services</LineLink>
        </div>
        <RevealGroup as="ul" className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TEASER.map((s) => (
            <li key={s.key} data-reveal>
              <ServiceCard service={s} compact />
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function WhyTeaser() {
  return (
    <section aria-labelledby="why-title" className="border-t border-line py-28 md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Why Axrok</p>
          <SplitHeading id="why-title" className="display mt-6 text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.02]">
            Senior operators. No handoffs.
          </SplitHeading>
          <div className="mt-12 flex flex-wrap items-center gap-10">
            <LineLink href="/about">About Axrok</LineLink>
            <CtaLink href="/contact" size="sm">
              Talk to Axrok
            </CtaLink>
          </div>
        </div>
        <RevealGroup as="ol" className="grid border-t border-l border-line sm:grid-cols-2 lg:col-span-7">
          {differentiators.map((d, i) => (
            <li key={d.title} data-reveal className="border-r border-b border-line p-7">
              <span className="eyebrow">0{i + 1}</span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{d.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{d.body}</p>
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
