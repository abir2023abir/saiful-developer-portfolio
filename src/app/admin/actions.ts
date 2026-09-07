"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  currentAdmin,
  destroySession,
  isConfigured,
  verifyCredentials,
} from "@/lib/auth";
import { readContent, updateContent } from "@/lib/content";
import { deleteMessage as removeMessage, setRead } from "@/lib/messages";
import type { Project } from "@/lib/types";

export type ActionState = { error?: string; ok?: string };

/** Every mutating action goes through this first — an action is a public endpoint. */
async function requireAdmin(): Promise<void> {
  if (!(await currentAdmin())) redirect("/admin/login");
}

function refresh() {
  revalidatePath("/", "layout");
}

/**
 * Storage can refuse a write — a read-only serverless filesystem is the common
 * case — and that has to reach the form as a message, not a 500.
 */
async function saved(work: () => Promise<unknown>): Promise<ActionState> {
  try {
    await work();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save." };
  }
  refresh();
  return { ok: "Saved." };
}

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const list = (form: FormData, key: string) =>
  str(form, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export async function login(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const username = str(form, "username");
  const password = String(form.get("password") ?? "");

  if (!username || !password)
    return { error: "Enter your username and password." };

  // Without the env vars every attempt fails as a plain mismatch, which sends
  // you hunting for a typo that is not there. Name the real problem instead.
  if (!isConfigured()) {
    return {
      error:
        "This deployment has no admin credentials set. Add ADMIN_USER, ADMIN_PASSWORD_HASH and AUTH_SECRET in the host's environment variables, then redeploy.",
    };
  }

  try {
    if (!verifyCredentials(username, password)) {
      return { error: "Those details do not match." };
    }
    await createSession(username);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Sign in failed." };
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function saveSite(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin();

  return saved(() =>
    updateContent((c) => ({
      ...c,
      site: {
        ...c.site,
        name: str(form, "name") || c.site.name,
        role: str(form, "role"),
        email: str(form, "email"),
        location: str(form, "location"),
        tagline: str(form, "tagline")
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        aboutHeading: str(form, "aboutHeading"),
        aboutBody: str(form, "aboutBody"),
        github: str(form, "github"),
        linkedin: str(form, "linkedin"),
        upwork: str(form, "upwork"),
        stack: list(form, "stack"),
      },
    })),
  );
}

export async function saveHighlights(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin();

  return saved(() =>
    updateContent((c) => ({
      ...c,
      stats: c.stats.map((s, i) => ({
        label: str(form, `stat-label-${i}`) || s.label,
        value: str(form, `stat-value-${i}`) || s.value,
        body: str(form, `stat-body-${i}`) || s.body,
      })),
      testimonial: {
        quote: str(form, "quote"),
        name: str(form, "author"),
        role: str(form, "authorRole"),
        rating: str(form, "rating"),
      },
    })),
  );
}

export async function saveServices(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const { services } = await readContent();
  const next = services
    .map((_, i) => ({
      n: str(form, `n-${i}`),
      title: str(form, `title-${i}`),
      body: str(form, `body-${i}`),
    }))
    .filter((s) => s.title);

  return saved(() => updateContent((c) => ({ ...c, services: next })));
}

export async function addService(): Promise<void> {
  await requireAdmin();
  await updateContent((c) => ({
    ...c,
    services: [
      ...c.services,
      {
        n: String(c.services.length + 1).padStart(2, "0"),
        title: "New service",
        body: "",
      },
    ],
  }));
  refresh();
}

export async function deleteService(formData: FormData): Promise<void> {
  await requireAdmin();
  const index = Number(formData.get("index"));
  await updateContent((c) => ({
    ...c,
    services: c.services.filter((_, i) => i !== index),
  }));
  refresh();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function saveProject(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const original = str(form, "originalSlug");
  const title = str(form, "title");
  if (!title) return { error: "A project needs a title." };

  const slug = slugify(str(form, "slug") || title);
  if (!slug)
    return {
      error: "That title does not make a usable URL — add some letters.",
    };

  const content = await readContent();
  const clash = content.projects.find(
    (p) => p.slug === slug && p.slug !== original,
  );
  if (clash) return { error: `Another project already uses /work/${slug}.` };

  const tintFrom = str(form, "tintFrom") || "#e8461c";
  const tintTo = str(form, "tintTo") || "#450a0a";

  const next: Project = {
    slug,
    title,
    category: str(form, "category"),
    year: str(form, "year"),
    summary: str(form, "summary"),
    stack: list(form, "stack"),
    tint: [tintFrom, tintTo],
    image: str(form, "image") || undefined,
    liveUrl: str(form, "liveUrl") || undefined,
    repoUrl: str(form, "repoUrl") || undefined,
    problem: str(form, "problem") || undefined,
    approach: str(form, "approach") || undefined,
    result: str(form, "result") || undefined,
    featured: form.get("featured") === "on",
  };

  const outcome = await saved(() =>
    updateContent((c) => {
      const exists = c.projects.some((p) => p.slug === original);
      return {
        ...c,
        projects: exists
          ? c.projects.map((p) => (p.slug === original ? next : p))
          : [...c.projects, next],
      };
    }),
  );
  if (outcome.error) return outcome;

  if (slug !== original) redirect(`/admin/projects/${slug}`);
  return outcome;
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  await updateContent((c) => ({
    ...c,
    projects: c.projects.filter((p) => p.slug !== slug),
  }));
  refresh();
  redirect("/admin/projects");
}

export async function moveProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const delta = Number(formData.get("delta"));

  await updateContent((c) => {
    const projects = [...c.projects];
    const from = projects.findIndex((p) => p.slug === slug);
    const to = from + delta;
    if (from === -1 || to < 0 || to >= projects.length) return c;
    [projects[from], projects[to]] = [projects[to], projects[from]];
    return { ...c, projects };
  });

  refresh();
}

export async function toggleMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  await setRead(
    String(formData.get("id") ?? ""),
    formData.get("read") === "true",
  );
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  await removeMessage(String(formData.get("id") ?? ""));
  revalidatePath("/admin/messages");
}
