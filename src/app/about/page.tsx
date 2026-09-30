import type { Metadata } from "next";
import { CtaLink } from "@/components/site/CtaLink";
import { Wordmark } from "@/components/brand/Mark";
import { ShardMark } from "@/components/brand/ShardMark";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { ScenePath, type SceneOffset } from "@/components/motion/ScenePath";
import { about, brand, differentiators, team } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "Axrok is a founder-led offensive security company, bootstrapped in Peshawar and headquartered in Pakistan, serving clients globally.",
  path: "/about",
});

// The wolf holds the left column, poised; content reads on the right.
const ABOUT_PATH: Record<string, SceneOffset> = {
  intro: {},
  principles: { rotY: 0.12, dim: 0.1 },
  story: { rotY: 0.45, wolfY: -0.1, dim: 0.2 },
  team: { rotY: 0.25, camZ: 0.6, dim: 0.25 },
  partners: { rotY: 0.2, dim: 0.2 },
  close: { rotY: 0.05, camZ: 0.2, dim: 0 },
};

const col = "lg:col-span-6 lg:col-start-7";

export default function AboutPage() {
  return (
    <>
      <section data-scene="intro" aria-labelledby="about-title" className="relative">
        <div className="mx-auto grid min-h-dvh max-w-[1440px] gap-12 px-5 pt-36 pb-20 md:px-10 lg:grid-cols-12 lg:pt-44">
          {/* Left: the wolf stands here in 3D; the fully formed mark sits beside it as a signature. */}
          <div className="order-2 flex items-end lg:order-1 lg:col-span-5">
            <div className="flex items-center gap-6">
              <ShardMark title="Axrok mark" className="h-28 w-auto text-cobalt-lift md:h-36" />
              <div className="border-l border-line pl-6">
                <Wordmark className="text-base text-ink" />
                <p className="mt-2 text-xs text-ink-dim">{brand.legalName}</p>
              </div>
            </div>
          </div>
          <div className={`order-1 self-center lg:order-2 ${col}`}>
            <p className="eyebrow">About</p>
            <SplitHeading
              as="h1"
              id="about-title"
              trigger="enter"
              className="display mt-6 text-[clamp(2.5rem,5.4vw,5.4rem)] leading-[0.97]"
            >
              Security, led by the people who do the work.
            </SplitHeading>
            <RevealGroup immediate delay={0.5} className="mt-10">
              <p data-reveal className="max-w-xl text-lg leading-relaxed text-ink-muted">
                {about.story[0]}
              </p>
            </RevealGroup>
          </div>
        </div>
      </section>

      <section data-scene="principles" aria-labelledby="principles-title" className="relative py-24 md:py-32">
        <h2 id="principles-title" className="sr-only">
          Mission and vision
        </h2>
        <div className="mx-auto grid max-w-[1440px] px-5 md:px-10 lg:grid-cols-12">
          <RevealGroup className={`grid gap-px border border-line bg-line md:grid-cols-2 ${col}`}>
            {[
              { label: "Mission", text: about.mission },
              { label: "Vision", text: about.vision },
            ].map((p) => (
              <div key={p.label} data-reveal className="bg-navy/85 p-8 backdrop-blur-md md:p-10">
                <h3 className="eyebrow">{p.label}</h3>
                {/* [PLACEHOLDER] pull the official wording from the Axrok brand bible */}
                <p className="display mt-6 text-2xl leading-snug text-ink/90">{p.text}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section data-scene="story" aria-labelledby="story-title" className="relative py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] px-5 md:px-10 lg:grid-cols-12">
          <div className={col}>
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
            <RevealGroup as="ul" className="mt-14 grid gap-4 sm:grid-cols-2">
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

      <section data-scene="team" aria-labelledby="team-title" className="relative py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] px-5 md:px-10 lg:grid-cols-12">
          <div className={col}>
            <p className="eyebrow">Leadership</p>
            <SplitHeading id="team-title" className="display mt-6 text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]">
              Founder-led, engagement by engagement.
            </SplitHeading>
            <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2">
              {team.map((m) => (
                <li key={m.name} data-reveal className="border border-line bg-navy/70 p-7 backdrop-blur-md">
                  <div
                    aria-hidden
                    className="flex size-16 items-center justify-center border border-cobalt-lift/50 font-display text-lg tracking-[0.12em] text-periwinkle [font-stretch:120%]"
                  >
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
        </div>
      </section>

      <section data-scene="partners" aria-labelledby="partners-title" className="relative py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] px-5 md:px-10 lg:grid-cols-12">
          <div className={col}>
            <p className="eyebrow">Partner network</p>
            <SplitHeading id="partners-title" className="display mt-6 text-[clamp(2rem,4vw,3.6rem)] leading-[1.02]">
              Depth where it counts.
            </SplitHeading>
            <RevealGroup className="mt-10">
              <p data-reveal className="text-lg leading-relaxed text-ink-muted">
                {about.partners}
              </p>
            </RevealGroup>
          </div>
        </div>
      </section>

      <section data-scene="close" aria-labelledby="about-close" className="relative py-28 md:py-40">
        <div className="mx-auto grid max-w-[1440px] px-5 md:px-10 lg:grid-cols-12">
          <div className={col}>
            <SplitHeading id="about-close" className="display text-[clamp(2.2rem,5vw,4.8rem)] leading-[1]">
              Work directly with the founders.
            </SplitHeading>
            <RevealGroup className="mt-10">
              <div data-reveal>
                <CtaLink href="/contact">Talk to Axrok</CtaLink>
              </div>
            </RevealGroup>
          </div>
        </div>
      </section>

      <ScenePath path={ABOUT_PATH} />
    </>
  );
}
