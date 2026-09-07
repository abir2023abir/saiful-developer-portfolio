import Nav from "./Nav";
import { Footer } from "./sections";
import { readContent } from "@/lib/content";
import { navLinks } from "@/lib/nav";

/** Chrome for every page that is not the home hero: solid nav, then the footer. */
export default async function PageShell({ children }: { children: React.ReactNode }) {
  const content = await readContent();

  return (
    <>
      <Nav links={navLinks(content)} name={content.site.name} variant="solid" />
      <main id="main" className="min-h-[60svh]">{children}</main>
      <Footer content={content} />
    </>
  );
}
