import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaLink, LineLink } from "@/components/site/CtaLink";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { serviceBySlug, services } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

// One template, six content entries (src/content/site.ts). Only these slugs exist.
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return pageMeta({ title: s.title, description: `${s.short} ${s.description}`, path: `/services/${s.slug}` });
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <section aria-labelledby="service-title">
        <div className="mx-auto max-w-[1440px] px-5 pt-32 pb-20 md:px-10 md:pt-44 md:pb-28">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.2em] text-ink-dim uppercase">
              <li>
                <Link href="/services" className="text-periwinkle underline decoration-transparent underline-offset-4 transition-colors hover:decoration-cobalt-lift">
                  Services
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page">{s.index}</li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SplitHeading as="h1" id="service-title" trigger="enter" className="display text-[clamp(2.5rem,5.6vw,5.6rem)] leading-[0.97]">
                {s.title}
              </SplitHeading>
              <RevealGroup immediate delay={0.45} className="mt-10 max-w-2xl">
                <p data-reveal className="text-lg leading-relaxed text-ink-muted md:text-xl">
                  {s.detail.intro}
                </p>
                {s.premium && (
                  <p data-reveal className="mt-6 border-l border-cobalt-lift/60 pl-5 text-sm text-ink-muted">
                    A premium engagement, delivered with Axrok&apos;s post-quantum security partner.
                  </p>
                )}
              </RevealGroup>
            </div>
            <RevealGroup immediate delay={0.6} className="flex flex-col items-start justify-end gap-6 lg:col-span-4">
              <div data-reveal>
                <CtaLink href={`/contact?service=${s.key}`}>Request this service</CtaLink>
              </div>
              <div data-reveal>
                <LineLink href="/services">All services</LineLink>
              </div>
            </RevealGroup>
          </div>
        </div>
      </section>

      <section aria-labelledby="scope-title" className="border-t border-line py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Scope of work</p>
            <SplitHeading id="scope-title" className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05]">
              What we cover.
            </SplitHeading>
          </div>
          {/* Hairlines are per-item borders, so nothing shows before the items reveal. */}
          <RevealGroup as="ol" className="grid border-t border-l border-line sm:grid-cols-2 lg:col-span-8">
            {s.detail.scope.map((item, i) => (
              <li key={item.title} data-reveal className="border-r border-b border-line p-7">
                <span className="font-mono text-xs text-periwinkle">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="engagement-title" className="border-t border-line bg-navy-deep/60 py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow">Typical engagement</p>
          <SplitHeading id="engagement-title" className="display mt-6 max-w-[20ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05]">
            What a typical engagement includes.
          </SplitHeading>
          <RevealGroup as="ol" className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none lg:gap-0">
            {s.detail.engagement.map((step, i) => (
              <li key={step.title} data-reveal className="relative lg:pr-8">
                <div className="flex items-center gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center border border-cobalt-lift/60 font-mono text-xs text-periwinkle">
                    {i + 1}
                  </span>
                  <span aria-hidden className="hidden h-px flex-1 bg-line lg:block" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="audience-title" className="border-t border-line py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Who it is for</p>
            <SplitHeading id="audience-title" className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05]">
              Built for teams like yours.
            </SplitHeading>
          </div>
          <RevealGroup as="ul" className="border-t border-line lg:col-span-8">
            {s.detail.audience.map((a) => (
              <li key={a} data-reveal className="flex gap-5 border-b border-line py-6">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-cobalt-lift" />
                <span className="text-lg text-ink">{a}</span>
              </li>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="service-close" className="border-t border-line py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SplitHeading id="service-close" className="display max-w-[20ch] text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1]">
            {`Talk to Axrok about ${s.navTitle.toLowerCase().replace("(soc)", "(SOC)").replace("grc", "GRC")}.`}
          </SplitHeading>
          <RevealGroup className="mt-10 flex flex-wrap items-center gap-8">
            <p data-reveal className="max-w-md text-ink-muted">
              Tell us what you need protected. A founder reads every enquiry and replies personally.
            </p>
            <div data-reveal>
              <CtaLink href={`/contact?service=${s.key}`}>Request this service</CtaLink>
            </div>
          </RevealGroup>

          <nav aria-label="Other services" className="mt-24 border-t border-line pt-8">
            <p className="eyebrow">Other services</p>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/services/${o.slug}`} className="text-sm text-ink-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-cobalt-lift">
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
