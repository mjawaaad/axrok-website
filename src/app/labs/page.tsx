import type { Metadata } from "next";
import Image from "next/image";
import { CtaLink } from "@/components/site/CtaLink";
import { ShardMark } from "@/components/brand/ShardMark";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { pageMeta } from "@/lib/metadata";
import wolfHead from "@/assets/wolf/graded-head.webp";
import wolf from "@/content/wolf.json";

export const metadata: Metadata = pageMeta({
  title: "Labs",
  description: "Axrok Labs will hold our future research and tooling. Coming soon.",
  path: "/labs",
});

/** Deliberately minimal: the mark, one line, the single CTA. */
export default function LabsPage() {
  return (
    <section aria-labelledby="labs-title" className="relative flex min-h-dvh items-center overflow-hidden">
      {/* A static, colour-graded crop of the same wolf: ambience only, no story. */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46vw] md:block">
        <Image
          src={wolfHead}
          alt=""
          fill
          sizes="46vw"
          className="object-cover opacity-45 [mask-image:linear-gradient(90deg,transparent,#000_45%)]"
        />
      </div>
      <span className="sr-only">{wolf.alt}</span>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 pt-28 pb-20 md:px-10">
        <ShardMark title="Axrok mark" className="h-24 w-auto text-cobalt-lift md:h-28" />
        <p className="eyebrow mt-12">Labs</p>
        <SplitHeading as="h1" id="labs-title" trigger="enter" className="display mt-5 text-[clamp(2.8rem,7vw,7rem)] leading-[0.94]">
          Coming soon.
        </SplitHeading>
        <RevealGroup immediate delay={0.5} className="mt-8 flex max-w-xl flex-col items-start gap-10">
          {/* [PLACEHOLDER] one-line description drafted from the brief */}
          <p data-reveal className="text-lg leading-relaxed text-ink-muted">
            Labs is where Axrok&apos;s future research and tooling will live.
          </p>
          <div data-reveal>
            <CtaLink href="/contact">Talk to Axrok</CtaLink>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
