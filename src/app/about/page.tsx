import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { Impact, Marquee } from "@/components/sections";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "How I work, what I build with, and what I will tell you before you commit.",
};

export default async function AboutPage() {
  const { site, stats, testimonial } = await readContent();

  return (
    <PageShell>
      <PageHeader
        label="About"
        title="The whole"
        tail="stack."
        lede={site.aboutBody}
      />
      <Marquee stack={site.stack} />

      <section className="bg-paper px-6 py-20 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="display text-[9vw] leading-[0.88] sm:text-[3.5rem]">How I work</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="space-y-6 text-[0.95rem] leading-relaxed text-black/65">
              <p>
                I scope in writing before I start, and I name the risky parts while they are still
                cheap to change. If something in a brief will not work, you hear it in the first
                conversation rather than the last week.
              </p>
              <p>
                I build back to front. The data model comes first, because it is the thing you cannot
                cheaply change later; the interface comes last, because by then it is only a view
                over something that already works.
              </p>
              <p>
                Everything ships with the boring parts done — validation on the server as well as the
                client, access enforced where the data lives, and seed data so the second developer
                can run it in a morning.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Impact heading={site.aboutHeading} body={site.aboutBody} stats={stats} testimonial={testimonial} />
    </PageShell>
  );
}
