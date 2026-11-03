import type { MetadataRoute } from "next";
import { readContent } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

const priority: Record<string, number> = {
  "": 1,
  "/work": 0.9,
  "/services": 0.9,
  "/about": 0.7,
  "/contact": 0.7,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await readContent();

  const pages = ["", "/about", "/work", "/services", "/contact"].map(
    (path) => ({
      url: `${siteUrl()}${path}`,
      changeFrequency: "monthly" as const,
      priority: priority[path],
    }),
  );

  const work = projects.map((p) => ({
    url: `${siteUrl()}/work/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...work];
}
