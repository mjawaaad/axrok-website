import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/site/CtaLink";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { MagicCard } from "@/components/ui/magic-card";
import { products } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "Products",
  description:
    "The Cyber Threat Intelligence platform, Brand Protection platform and Dark Web Monitoring tooling that power Axrok's service delivery. Not yet sold as standalone products.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <section aria-labelledby="products-title">
        <div className="mx-auto max-w-[1440px] px-5 pt-36 pb-16 md:px-10 md:pt-48 md:pb-20">
          <p className="eyebrow">Products</p>
          <SplitHeading as="h1" id="products-title" trigger="enter" className="display mt-6 max-w-[15ch] text-[clamp(2.6rem,6.2vw,6.2rem)] leading-[0.95]">
            The platforms behind the service.
          </SplitHeading>
          <RevealGroup immediate delay={0.5} className="mt-10 grid max-w-3xl gap-6">
            {/* [PLACEHOLDER] intro drafted from the brief */}
            <p data-reveal className="text-lg leading-relaxed text-ink-muted">
              Axrok builds its own tooling so analysts spend their time on judgement, not collection. These platforms power our
              intelligence, brand protection and monitoring work today.
            </p>
            {/* brief: a clear line that these are not yet sold standalone */}
            <p data-reveal className="flex items-start gap-3 border-l border-cobalt-lift/60 pl-5 text-ink">
              They are not yet sold as standalone products. You get them through an Axrok engagement.
            </p>
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="platforms-title" className="pb-28 md:pb-36">
        <h2 id="platforms-title" className="sr-only">
          Platforms
        </h2>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <RevealGroup as="ul" className="grid gap-4 lg:grid-cols-3">
            {products.map((p, i) => (
              <li key={p.key} data-reveal>
                <MagicCard gradientSize={320} gradientColor="#1e3aff" gradientOpacity={0.14} gradientFrom="#5b70ff" gradientTo="#1e3aff" className="h-full rounded-none">
                  <article aria-labelledby={`${p.key}-title`} className="flex h-full flex-col p-7 md:p-9">
                    <span className="eyebrow">0{i + 1}</span>
                    <h3 id={`${p.key}-title`} className="display mt-8 text-[1.55rem] leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-4 leading-relaxed text-ink-muted">{p.body}</p>
                    <p className="mt-auto pt-10 text-xs tracking-[0.12em] text-ink-dim uppercase">
                      Powers{" "}
                      <Link href={`/services/${p.slug}`} className="text-periwinkle underline decoration-periwinkle/40 underline-offset-4 transition-colors hover:decoration-cobalt-lift">
                        {p.powers}
                      </Link>
                    </p>
                  </article>
                </MagicCard>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="products-close" className="border-t border-line py-28 md:py-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SplitHeading id="products-close" className="display max-w-[18ch] text-[clamp(2.2rem,5vw,4.8rem)] leading-[1]">
            Want to see what they find for you?
          </SplitHeading>
          <RevealGroup className="mt-10 flex flex-wrap items-center gap-8">
            <p data-reveal className="max-w-md text-ink-muted">
              No pricing pages and no sign-ups. Tell us about your exposure and we will show you how we would watch it.
            </p>
            <div data-reveal>
              <CtaLink href="/contact?service=cti">Start the Conversation</CtaLink>
            </div>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
