import { HighlightsForm, SiteForm } from "@/components/admin/SiteForm";
import { readContent } from "@/lib/content";

export default async function SitePage() {
  const { site, stats, testimonial } = await readContent();

  return (
    <div className="space-y-14">
      <section>
        <h2 className="mb-6 font-display text-xl font-bold tracking-tight">Site & profile</h2>
        <SiteForm site={site} />
      </section>

      <section>
        <h2 className="mb-6 font-display text-xl font-bold tracking-tight">Stats & testimonial</h2>
        <HighlightsForm stats={stats} testimonial={testimonial} />
      </section>
    </div>
  );
}
