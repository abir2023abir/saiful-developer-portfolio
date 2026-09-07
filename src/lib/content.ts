import { seed } from "./seed";
import { storage } from "./storage";
import type { Content, Project } from "./types";

const KEY = "site.json";

/**
 * The live content. Reads fall back to the shipped seed, so a fresh deploy with
 * an empty store still renders the full site rather than an empty shell.
 */
export async function readContent(): Promise<Content> {
  const parsed = await storage().readJson<Partial<Content>>(KEY);
  if (!parsed) return seed;

  return {
    site: { ...seed.site, ...parsed.site },
    services: parsed.services ?? seed.services,
    stats: parsed.stats ?? seed.stats,
    testimonial: { ...seed.testimonial, ...parsed.testimonial },
    projects: parsed.projects ?? seed.projects,
  };
}

export async function writeContent(next: Content): Promise<void> {
  await storage().writeJson(KEY, next);
}

export async function updateContent(patch: (current: Content) => Content): Promise<Content> {
  const next = patch(await readContent());
  await writeContent(next);
  return next;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const { projects } = await readContent();
  return projects.find((p) => p.slug === slug);
}
