import type { MetadataRoute } from "next";
import { readContent } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await readContent();
  const now = new Date();

  const pages = ["", "/about", "/work", "/services", "/contact"].map((path) => ({
    url: `${siteUrl()}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const work = projects.map((p) => ({
    url: `${siteUrl()}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...work];
}
