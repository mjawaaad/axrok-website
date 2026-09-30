import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Signature } from "@/components/brand/Signature";
import { brand } from "@/content/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Request a penetration test, managed security, compliance readiness, threat intelligence or post-quantum assessment from Axrok. One form, answered by the founding team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section aria-labelledby="contact-title" className="mx-auto max-w-[1440px] px-5 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow">Contact</p>
          <SplitHeading
            as="h1"
            id="contact-title"
            trigger="enter"
            className="display mt-6 text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98]"
          >
            {brand.tagline}
          </SplitHeading>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            Tell us what you need protected. Every enquiry is read by the founding team and answered
            personally.
          </p>

          <div className="mt-14">
            <ContactForm />
          </div>
        </div>

        {/* The wolf holds this column in 3D; the signature sits quietly beneath it. */}
        <aside aria-label="Axrok" className="lg:col-span-4 lg:col-start-9">
          {/* Pinned to the viewport like the canvas, so the signature always sits below the wolf. */}
          <div className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-end lg:pb-14">
            <Signature />
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
