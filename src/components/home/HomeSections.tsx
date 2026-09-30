import Link from "next/link";
import { Arrow, CtaLink, LineLink } from "@/components/site/CtaLink";
import { Corners } from "@/components/site/Corners";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { Marquee } from "@/components/ui/marquee";
import { brand, differentiators, industries, services } from "@/content/site";

export function HomeHero() {
  return (
    <section data-scene="hero" aria-labelledby="hero-title" className="relative flex min-h-dvh flex-col justify-end">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 md:px-10 md:pb-14">
        <p className="eyebrow">Offensive security · Managed defense · Threat intelligence</p>
        <SplitHeading
          as="h1"
          id="hero-title"
          trigger="enter"
          delay={0.15}
          className="display mt-5 text-[clamp(2.75rem,min(7vw,12.5vh),8.25rem)] leading-[0.92]"
        >
          Precision Offense. <br className="hidden sm:block" />
          Absolute Defense.
        </SplitHeading>
        <RevealGroup
          immediate
          delay={0.6}
          className="mt-8 flex flex-col gap-6 border-t border-line pt-7 md:flex-row md:items-center md:justify-between"
        >
          {/* [PLACEHOLDER] hero summary line drafted from the brief */}
          <p data-reveal className="max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            Axrok is a full-service offensive security firm. We test, monitor and defend the systems your organization
            runs on, whatever your industry.
          </p>
          <div data-reveal className="flex items-center gap-8">
            <CtaLink href="/contact">Request an Assessment</CtaLink>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}

const TEASER = services.filter((s) => s.key !== "pqc");

export function ServicesTeaser() {
  return (
    <section data-scene="services" aria-labelledby="services-teaser-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="max-w-[58%] max-lg:max-w-none">
          <p className="eyebrow">What we do</p>
          <SplitHeading id="services-teaser-title" className="display mt-6 text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.02]">
            One partner across offense, defense and intelligence.
          </SplitHeading>
        </div>

        <RevealGroup as="ul" className="mt-16 grid gap-4 sm:grid-cols-2 lg:w-[62%]">
          {TEASER.map((s) => (
            <li key={s.key} data-reveal>
              <Link
                href={`/services#${s.key}`}
                className="group/card group/cta relative flex h-full flex-col border border-line bg-navy/55 p-7 backdrop-blur-md transition-colors duration-500 hover:border-cobalt-lift/50 md:p-8"
              >
                <Corners />
                <span className="eyebrow">{s.index}</span>
                <h3 className="display mt-10 text-[1.45rem] leading-tight">{s.title}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">{s.short}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-periwinkle uppercase">
                  Explore <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </RevealGroup>

        <div className="mt-12 flex flex-wrap items-center gap-10">
          <LineLink href="/services">All five services</LineLink>
          <CtaLink href="/contact" size="sm">
            Request an Assessment
          </CtaLink>
        </div>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section data-scene="industries" aria-labelledby="industries-title" className="relative border-y border-line bg-navy/40 py-10 backdrop-blur-sm">
      <h2 id="industries-title" className="sr-only">
        Industries we serve
      </h2>
      <div className="mx-auto mb-6 max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow">{brand.location}</p>
      </div>
      {/* [PLACEHOLDER] industries list lives in src/content/site.ts */}
      <Marquee pauseOnHover className="[--duration:48s] [--gap:3.5rem] motion-reduce:[&>*]:animate-none" repeat={3}>
        {industries.map((name) => (
          <span key={name} className="display flex items-center gap-14 text-2xl text-ink-muted/80 md:text-3xl">
            {name}
            <span aria-hidden className="size-1.5 rotate-45 bg-cobalt-lift/70" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}

export function WhyTeaser() {
  return (
    <section data-scene="why" aria-labelledby="why-title" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">Why Axrok</p>
          <SplitHeading id="why-title" className="display mt-6 text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.02]">
            Senior operators. No handoffs.
          </SplitHeading>
          <RevealGroup as="ol" className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2">
            {differentiators.map((d, i) => (
              <li key={d.title} data-reveal className="bg-navy/85 p-7 backdrop-blur-md">
                <span className="eyebrow">0{i + 1}</span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{d.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{d.body}</p>
              </li>
            ))}
          </RevealGroup>
          <div className="mt-12 flex flex-wrap items-center gap-10">
            <LineLink href="/about">About Axrok</LineLink>
            <CtaLink href="/contact" size="sm">
              Talk to Axrok
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section data-scene="cta" aria-labelledby="closing-title" className="relative flex min-h-[80dvh] items-end pb-24 md:pb-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <SplitHeading id="closing-title" className="display max-w-[16ch] text-[clamp(2.4rem,6vw,6rem)] leading-[0.96]">
          Find the gaps before anyone else does.
        </SplitHeading>
        <RevealGroup className="mt-10 flex flex-wrap items-center gap-8">
          <p data-reveal className="max-w-md text-ink-muted">
            Tell us what you need protected. The founding team replies personally.
          </p>
          <div data-reveal>
            <CtaLink href="/contact">Start the Conversation</CtaLink>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
