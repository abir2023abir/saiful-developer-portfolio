import Image from "next/image";
import Link from "next/link";
import { readContent } from "@/lib/content";
import { moveProject } from "../../actions";

export default async function ProjectsPage() {
  const { projects } = await readContent();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Projects
          </h2>
          <p className="mt-1 text-sm text-black/55">
            The order here is the order on the site. The first four appear on
            the home page.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand"
        >
          Add a project
        </Link>
      </div>

      <ul className="divide-y divide-black/10 border border-black/10 bg-white">
        {projects.map((p, i) => (
          <li key={p.slug} className="flex items-center gap-4 p-4">
            <div className="relative h-14 w-24 shrink-0 overflow-hidden border border-black/10 bg-smoke">
              {p.image ? (
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover object-top"
                />
              ) : (
                <span
                  className="block h-full w-full"
                  style={{
                    background: `linear-gradient(140deg, ${p.tint[0]}, ${p.tint[1]})`,
                  }}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {p.title}
                {p.featured && (
                  <span className="ml-2 text-xs font-normal text-brand-ink">
                    featured
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-black/55">
                /work/{p.slug} · {p.category || "no category"} · {p.year}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <form action={moveProject}>
                <input type="hidden" name="slug" value={p.slug} />
                <input type="hidden" name="delta" value={-1} />
                <button
                  disabled={i === 0}
                  aria-label={`Move ${p.title} up`}
                  className="px-2 py-1 text-black/55 transition-colors hover:text-ink disabled:opacity-25"
                >
                  ↑
                </button>
              </form>
              <form action={moveProject}>
                <input type="hidden" name="slug" value={p.slug} />
                <input type="hidden" name="delta" value={1} />
                <button
                  disabled={i === projects.length - 1}
                  aria-label={`Move ${p.title} down`}
                  className="px-2 py-1 text-black/55 transition-colors hover:text-ink disabled:opacity-25"
                >
                  ↓
                </button>
              </form>
              <Link
                href={`/admin/projects/${p.slug}`}
                className="ml-2 border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-white"
              >
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
