import type { Metadata } from "next";
import HomeShell from "@/components/HomeShell";
import { Impact, Marquee, Services, Work, Footer } from "@/components/sections";
import { readContent } from "@/lib/content";
import { navLinks } from "@/lib/nav";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await readContent();
  return pageMeta({
    title: { absolute: `${site.name} — ${site.role} in Dhaka` },
    description:
      "Saiful Islam is a full stack web developer in Dhaka. He builds production web applications with Next.js, TypeScript, Node and Laravel, from the data model to the interface.",
    path: "/",
  });
}

export default async function Home() {
  const content = await readContent();

  return (
    <>
      <HomeShell content={content} links={navLinks(content)}>
        <Marquee stack={content.site.stack} />
        <Impact
          heading={content.site.aboutHeading}
          body={content.site.aboutBody}
          stats={content.stats}
          testimonials={content.testimonials}
        />
        <Work projects={content.projects} limit={4} />
        <Services services={content.services} />
      </HomeShell>
      <Footer content={content} />
    </>
  );
}
