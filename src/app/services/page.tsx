import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SplitLines from "@/components/SplitLines";
import { Services } from "@/components/sections";
import JsonLd from "@/components/JsonLd";
import { readContent } from "@/lib/content";
import { breadcrumbJsonLd, pageMeta, servicesJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Web Development Services",
  description:
    "Full stack web development from Dhaka: applications, e-commerce, APIs and databases, authentication, realtime features and interface performance.",
  path: "/services",
});

export default async function ServicesPage() {
  const { services } = await readContent();

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          servicesJsonLd(services),
        ]}
      />
      <PageHeader
        label="Services"
        title="What I"
        tail="do."
        lede="A short list, done properly, rather than a long one done once."
      />
      <Services services={services} />

      <section className="bg-paper px-6 py-24 text-center sm:px-10">
        <Reveal>
          <SplitLines
            as="h2"
            lines={[{ text: "Need one of these", tail: "built?" }]}
            className="display text-[11vw] leading-[0.86] sm:text-[4.5rem]"
          />
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-3 bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand"
          >
            Start a conversation
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}
