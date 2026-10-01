import { notFound } from "next/navigation";
import { serviceBySlug, services } from "@/content/site";

// One template, six content entries. Only these slugs exist.
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// Stage 1 stub: the template is built in stage 4.
export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = serviceBySlug(slug);
  if (!service) notFound();
  return (
    <section className="flex min-h-dvh items-end px-10 pb-24">
      <h1 className="display text-6xl">{service.title}</h1>
    </section>
  );
}
