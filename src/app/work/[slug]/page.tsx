import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import { readContent } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = await readContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await readContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} — ${project.category}`,
    description: project.summary,
  };
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const { projects } = await readContent();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const body: Array<[string, string | undefined]> = [
    ["The problem", project.problem],
    ["The approach", project.approach],
    ["The result", project.result],
  ];
  const hasBody = body.some(([, text]) => text);

  return (
    <PageShell>
      <header
        className="relative overflow-hidden px-6 pb-16 pt-20 sm:px-10 sm:pb-20 sm:pt-28"
        style={{
          background: `linear-gradient(140deg, ${project.tint[0]}, ${project.tint[1]})`,
        }}
      >
        {/* The tint is chosen in the admin panel and can be light, so a scrim
            guarantees the white type keeps its contrast whatever it is set to. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.22))",
          }}
          aria-hidden
        />
        <div className="grid-lines absolute inset-0 opacity-30" aria-hidden />
        <div className="relative">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 border border-white/30 px-3 py-1.5 text-white/90">
              <span>✳</span> {project.category} · {project.year}
            </span>
          </Reveal>
          <Reveal>
            <h1 className="display mt-6 text-[14vw] leading-[0.84] text-white sm:text-[7rem]">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-2xl text-[0.95rem] leading-relaxed text-white">
              {project.summary}
            </p>
          </Reveal>
        </div>
      </header>

      {project.image && (
        <Reveal>
          <div className="bg-paper px-6 py-12 sm:px-10">
            <div className="relative aspect-16/10 w-full overflow-hidden border border-black/10">
              <Image
                src={project.image}
                alt={`${project.title} interface`}
                fill
                sizes="100vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </Reveal>
      )}

      <section className="bg-paper px-6 pb-24 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-12">
            {hasBody ? (
              body.map(([heading, text]) =>
                text ? (
                  <Reveal key={heading}>
                    <h2 className="display text-[8vw] leading-[0.9] sm:text-[2.5rem]">
                      {heading}
                    </h2>
                    <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-black/65">
                      {text}
                    </p>
                  </Reveal>
                ) : null,
              )
            ) : (
              <Reveal>
                <p className="max-w-2xl text-[0.95rem] leading-relaxed text-black/55">
                  A full write-up for this project is still to come. Add the
                  problem, approach and result in the admin panel and they will
                  appear here.
                </p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.1}>
            <aside className="h-fit border border-black/10 bg-white p-6">
              <h2 className="eyebrow text-black/60">Details</h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="eyebrow text-black/55">Role</dt>
                  <dd className="mt-1">
                    Full-stack — design, API, database, interface
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-black/55">Year</dt>
                  <dd className="mt-1">{project.year}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-black/55">Stack</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-black/15 px-2.5 py-1 text-[0.68rem] uppercase tracking-wider text-black/55"
                      >
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              {(project.liveUrl || project.repoUrl) && (
                <div className="mt-7 flex flex-col gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-ink px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand"
                    >
                      Visit the live site ↗
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-ink px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-white"
                    >
                      Read the code ↗
                    </a>
                  )}
                </div>
              )}
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-black/10 bg-paper px-6 py-16 sm:px-10">
        <Link href={`/work/${next.slug}`} className="group block">
          <span className="eyebrow text-black/55">Next project</span>
          <span className="display mt-3 block text-[12vw] leading-[0.86] transition-colors group-hover:text-brand-ink sm:text-[5rem]">
            {next.title} →
          </span>
        </Link>
      </section>
    </PageShell>
  );
}
