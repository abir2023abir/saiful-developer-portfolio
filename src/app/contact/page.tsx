import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { SectionLabel } from "@/components/sections";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what you are building. I reply with a scope, a timeline and the risky parts.",
};

export default async function ContactPage() {
  const { site } = await readContent();

  return (
    <PageShell>
      <section id="contact" className="bg-paper px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(340px,400px)_1fr] lg:items-center">
          <Reveal>
            <ContactForm site={site} />
          </Reveal>

          <div>
            <Reveal>
              <SectionLabel>Contact me</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="display mt-6 text-[13vw] leading-[0.84] sm:text-[7rem]">
                Let&apos;s work
                <br />
                <span className="text-black/45">together.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-black/65">
                Tell me what you are building and what has to be true for it to work. I will come
                back with a scope, a timeline and the parts I think are risky — before either of us
                commits.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a
                  href={`mailto:${site.email}`}
                  className="font-display text-lg font-bold tracking-tight underline decoration-brand decoration-2 underline-offset-4"
                >
                  {site.email}
                </a>
                <a
                  href={site.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow border border-ink px-3 py-1.5 transition-colors hover:bg-ink hover:text-white"
                >
                  Hire on Upwork ↗
                </a>
                <span className="eyebrow text-black/55">{site.location}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
