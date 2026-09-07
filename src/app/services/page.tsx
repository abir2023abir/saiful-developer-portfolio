import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { Services } from "@/components/sections";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: "Full-stack builds, e-commerce, API and database design, auth, realtime and performance.",
};

export default async function ServicesPage() {
  const { services } = await readContent();

  return (
    <PageShell>
      <PageHeader
        label="Services"
        title="What I"
        tail="do."
        lede="A short list, done properly, rather than a long one done once."
      />
      <Services services={services} />

      <section className="bg-paper px-6 py-24 text-center sm:px-10">
        <Reveal>
          <h2 className="display text-[11vw] leading-[0.86] sm:text-[4.5rem]">
            Need one of these <span className="text-black/45">built?</span>
          </h2>
          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-3 bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand"
          >
            Start a conversation
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}
