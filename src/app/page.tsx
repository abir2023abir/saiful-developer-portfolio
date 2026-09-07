import HomeShell from "@/components/HomeShell";
import { Impact, Marquee, Services, Work, Footer } from "@/components/sections";
import { readContent } from "@/lib/content";
import { navLinks } from "@/lib/nav";

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
          testimonial={content.testimonial}
        />
        <Work projects={content.projects} limit={4} />
        <Services services={content.services} />
      </HomeShell>
      <Footer content={content} />
    </>
  );
}
