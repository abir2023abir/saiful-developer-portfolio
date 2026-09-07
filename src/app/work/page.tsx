import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import { ProjectGrid } from "@/components/sections";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected full-stack projects: ERP, SaaS dashboards, storefronts and realtime apps.",
};

export default async function WorkPage() {
  const { projects } = await readContent();

  return (
    <PageShell>
      <PageHeader
        label={`Portfolio (${String(projects.length).padStart(2, "0")})`}
        title="Selected"
        tail="work."
        lede="Every one of these is a working application rather than a mockup — schema, API, auth and interface. Open any of them for the problem it solves and how."
      />
      <section className="bg-paper px-6 pb-28 sm:px-10">
        <ProjectGrid projects={projects} />
      </section>
    </PageShell>
  );
}
