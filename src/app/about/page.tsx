import type { Metadata } from "next";
import Image from "next/image";
import { CtaLink } from "@/components/site/CtaLink";
import { Wordmark } from "@/components/brand/Mark";
import { ShardMark } from "@/components/brand/ShardMark";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { about, brand, differentiators, team } from "@/content/site";
import { pageMeta } from "@/lib/metadata";
import wolfHead from "@/assets/wolf/graded-head.webp";
import wolf from "@/content/wolf.json";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "Axrok is a founder-led offensive security company, bootstrapped in Peshawar and headquartered in Pakistan, serving clients globally.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-title">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pt-36 pb-20 md:px-10 lg:min-h-[88dvh] lg:grid-cols-12 lg:pt-44">
          <div className="self-center lg:col-span-7">
            <p className="eyebrow">About</p>
            <SplitHeading as="h1" id="about-title" trigger="enter" className="display mt-6 text-[clamp(2.5rem,5.6vw,5.6rem)] leading-[0.97]">
              Security, led by the people who do the work.
            </SplitHeading>
            <RevealGroup immediate delay={0.5} className="mt-10">
              <p data-reveal className="max-w-xl text-lg leading-relaxed text-ink-muted">
                {about.story[0]}
              </p>
            </RevealGroup>
          </div>
          {/* The fully formed mark, once on this page, as a signature of trust. */}
          <div className="flex items-end lg:col-span-4 lg:col-start-9">
            <div className="flex items-center gap-6">
              <ShardMark title="Axrok mark" className="h-28 w-auto text-cobalt-lift md:h-40" />
              <div className="border-l border-line pl-6">
                <Wordmark className="text-base text-ink" />
                <p className="mt-2 text-xs text-ink-dim">{brand.legalName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-t border-line py-24 md:py-32">
        <h2 id="principles-title" className="sr-only">
          Mission and vision
        </h2>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <RevealGroup className="grid border-t border-l border-line md:grid-cols-2">
            {[
              { label: "Mission", text: about.mission },
              { label: "Vision", text: about.vision },
            ].map((p) => (
              <div key={p.label} data-reveal className="border-r border-b border-line p-8 md:p-12">
                <h3 className="eyebrow">{p.label}</h3>
                {/* [PLACEHOLDER] pull the official wording from the Axrok brand bible */}
                <p className="display mt-6 text-2xl leading-snug text-ink/90 md:text-3xl">{p.text}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="story-title" className="py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          {/* Optional static still of the same wolf; no story outside Home. */}
          <RevealGroup className="lg:col-span-5">
            <figure data-reveal className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image src={wolfHead} alt={wolf.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </figure>
          </RevealGroup>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">Our story</p>
            <SplitHeading id="story-title" className="display mt-6 text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]">
              Bootstrapped in Peshawar. Built for the world.
            </SplitHeading>
            <RevealGroup className="mt-10 space-y-6 text-lg leading-relaxed text-ink-muted">
              <p data-reveal>{about.story[1]}</p>
              <p data-reveal>{brand.location}</p>
              <p data-reveal className="border-l border-cobalt-lift/60 pl-6 text-base text-ink-muted">
                {about.nameStory}
              </p>
            </RevealGroup>
            <RevealGroup as="ul" className="mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {differentiators.map((d) => (
                <li key={d.title} data-reveal className="border-t border-line pt-5">
                  <h3 className="font-semibold text-ink">{d.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{d.body}</p>
                </li>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section aria-labelledby="team-title" className="border-t border-line py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow">Leadership</p>
          <SplitHeading id="team-title" className="display mt-6 max-w-[18ch] text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]">
            Founder-led, engagement by engagement.
          </SplitHeading>
          <RevealGroup as="ul" className="mt-14 grid gap-4 md:grid-cols-3">
            {team.map((m) => (
              <li key={m.name} data-reveal className="border border-line bg-navy-deep/60 p-7 md:p-8">
                <div aria-hidden className="flex size-16 items-center justify-center border border-cobalt-lift/50 font-display text-lg tracking-[0.12em] text-periwinkle [font-stretch:120%]">
                  {m.initials}
                </div>
                <h3 className="mt-8 text-xl font-semibold text-ink">{m.name}</h3>
                <p className="mt-1 text-sm tracking-[0.08em] text-periwinkle uppercase">{m.role}</p>
                {/* [PLACEHOLDER] confirm each person's certifications */}
                <p className="mt-5 border-t border-line pt-4 text-sm text-ink-muted">{m.certifications}</p>
              </li>
            ))}
          </RevealGroup>
          <p className="mt-6 text-sm text-ink-dim">Team certifications include CEH, eCPPT and eWPTX.</p>
        </div>
      </section>

      <section aria-labelledby="partners-title" className="border-t border-line py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Partner network</p>
            <SplitHeading id="partners-title" className="display mt-6 text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]">
              Depth where it counts.
            </SplitHeading>
          </div>
          <RevealGroup className="self-end lg:col-span-6 lg:col-start-7">
            <p data-reveal className="text-lg leading-relaxed text-ink-muted">
              {about.partners}
            </p>
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="about-close" className="border-t border-line py-28 md:py-40">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SplitHeading id="about-close" className="display max-w-[16ch] text-[clamp(2.2rem,5vw,4.8rem)] leading-[1]">
            Work directly with the founders.
          </SplitHeading>
          <RevealGroup className="mt-10">
            <div data-reveal>
              <CtaLink href="/contact">Talk to Axrok</CtaLink>
            </div>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
