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
  const origin = siteUrl();
  const { projects } = await readContent();

  const pages = ["", "/about", "/work", "/services", "/contact"].map(
    (path) => ({
      url: `${origin}${path}`,
      changeFrequency: "monthly" as const,
      priority: priority[path],
    }),
  );

  const work = projects.map((p) => {
    const image = p.image
      ? p.image.startsWith("http")
        ? p.image
        : `${origin}${p.image}`
      : undefined;
    return {
      url: `${origin}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(image ? { images: [image] } : {}),
    };
  });

  return [...pages, ...work];
}
