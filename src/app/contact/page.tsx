import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { RevealGroup } from "@/components/motion/Reveal";
import { Mark, Wordmark } from "@/components/brand/Mark";
import { brand } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Request penetration testing, managed security, compliance readiness, threat intelligence, post-quantum or space and satellite security from Axrok. One form, answered by the founding team.",
  path: "/contact",
});

// [PLACEHOLDER] drafted; confirm the process and any response-time commitment
const nextSteps = [
  { title: "We read it", body: "A founder reads every enquiry personally." },
  { title: "We reply", body: "You hear back by email with questions or a time to talk." },
  { title: "We scope", body: "A short call to agree scope, timing and the right tier." },
];

/** The one contact form on the site. Calm and fast: no wolf, the mark as a closing signature. */
export default function ContactPage() {
  return (
    <section aria-labelledby="contact-title" className="mx-auto max-w-[1440px] px-5 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
      <p className="eyebrow">Contact</p>
      <SplitHeading as="h1" id="contact-title" trigger="enter" className="display mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98]">
        {brand.tagline}
      </SplitHeading>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
        Tell us what you need protected. Every enquiry is read by the founding team and answered personally.
      </p>

      <div className="mt-14 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside aria-label="About this form" className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-6">
              <Mark title="Axrok mark" className="h-24 w-auto text-cobalt-lift" />
              <div className="border-l border-line pl-6">
                <Wordmark className="text-sm text-ink" />
                <p className="mt-1.5 text-xs text-ink-dim">{brand.tagline}</p>
              </div>
            </div>

            <RevealGroup as="ol" className="mt-12 border-t border-line">
              {nextSteps.map((s, i) => (
                <li key={s.title} data-reveal className="flex gap-5 border-b border-line py-5">
                  <span className="font-mono text-xs text-periwinkle">0{i + 1}</span>
                  <div>
                    <p className="font-semibold text-ink">{s.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </RevealGroup>

            <p className="mt-8 max-w-xs text-sm text-ink-dim">
              {brand.legalName}
              <br />
              {brand.location}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
