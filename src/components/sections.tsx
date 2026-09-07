import Link from "next/link";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import type { Content, Project, Service, Stat, Testimonial } from "@/lib/types";

export function Marquee({ stack }: { stack: string[] }) {
  const row = [...stack, ...stack];
  return (
    <section className="border-b border-black/10 bg-paper py-10">
      <div className="flex items-center gap-10 px-6 sm:px-10">
        <p className="eyebrow hidden shrink-0 leading-relaxed text-black/60 sm:block">
          Built
          <br />
          with
        </p>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-14">
            {row.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="whitespace-nowrap font-display text-xl font-bold tracking-tight text-black/45 sm:text-2xl"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 px-3 py-1.5 ${
        dark ? "border border-white/20 text-white/70" : "bg-smoke"
      }`}
    >
      <span className="text-brand-ink">✳</span> {children}
    </span>
  );
}

export function Impact({
  heading,
  body,
  stats,
  testimonial,
}: {
  heading: string;
  body: string;
  stats: Stat[];
  testimonial: Testimonial;
}) {
  // Pipes mark the line breaks; the even-indexed words carry the grey.
  const parts = heading.split("|");

  return (
    <section id="about" className="bg-paper px-6 py-24 sm:px-10 sm:py-32">
      <Reveal>
        <SectionLabel>Better digital products.</SectionLabel>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_minmax(300px,26rem)] lg:items-end">
        <Reveal>
          <h2 className="display text-[11vw] leading-[0.85] sm:text-[6.5rem]">
            {parts.map((part, i) => (
              <span
                key={part + i}
                className={i % 2 ? "text-black/45" : undefined}
              >
                {part}
                {i % 2 === 1 && i < parts.length - 1 ? <br /> : " "}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-black/65">
            {body}
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-4 lg:grid-cols-[0.9fr_1.6fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="h-full border border-black/10 bg-white p-6 transition-colors hover:border-brand/40">
                <span className="eyebrow flex items-center gap-2 text-black/60">
                  <span className="text-brand-ink">✳</span> {s.label}
                </span>
                <p className="display mt-8 text-6xl sm:text-7xl">{s.value}</p>
                <p className="mt-4 text-sm leading-relaxed text-black/55">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <figure className="relative flex h-full flex-col justify-end overflow-hidden border border-black/10 bg-white p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(60% 70% at 78% 22%, #f97316 0%, transparent 60%), radial-gradient(70% 80% at 20% 10%, #6366f1 0%, transparent 55%), radial-gradient(80% 60% at 60% 0%, #10b981 0%, transparent 50%)",
                filter: "blur(46px)",
              }}
              aria-hidden
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-brand-ink" aria-hidden>
                  ★★★★★
                </span>
                <span className="text-sm font-semibold">
                  {testimonial.rating}
                </span>
              </div>
              <blockquote className="mt-5 max-w-xl text-lg leading-relaxed text-black/80">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
                  ✳
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">
                    {testimonial.name}
                  </span>
                  <span className="block text-xs text-black/55">
                    {testimonial.role}
                  </span>
                </span>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2">
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}

export function Work({
  projects,
  limit,
}: {
  projects: Project[];
  limit?: number;
}) {
  const shown = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="work" className="bg-paper px-6 pb-28 sm:px-10">
      <Reveal>
        <SectionLabel>Portfolio</SectionLabel>
      </Reveal>
      <Reveal>
        <h2 className="display mt-6 text-[13vw] leading-[0.85] sm:text-[7.5rem]">
          Selected <span className="text-black/45">work.</span>
        </h2>
      </Reveal>

      <div className="mt-14">
        <ProjectGrid projects={shown} />
      </div>

      {limit && projects.length > limit && (
        <Reveal>
          <div className="mt-16 flex justify-center">
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 border border-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-white"
            >
              All {projects.length} projects
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      )}
    </section>
  );
}

export function Services({ services }: { services: Service[] }) {
  return (
    <section
      id="services"
      className="bg-ink px-6 py-24 text-white sm:px-10 sm:py-32"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <Reveal>
          <SectionLabel dark>
            Services ({String(services.length).padStart(2, "0")})
          </SectionLabel>
          <h2 className="display mt-6 text-[12vw] leading-[0.85] sm:text-[6rem]">
            What I <span className="text-white/35">do.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-white/55">
            A short list, done properly, rather than a long one done once. If
            your problem is not on it, say so — I would rather tell you it is
            not my work than take it and learn on your budget.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 border-t border-white/12">
        {services.map((s, i) => (
          <Reveal key={s.n + s.title} delay={(i % 3) * 0.06}>
            <div className="group grid gap-4 border-b border-white/12 py-8 transition-colors hover:bg-white/[0.04] sm:grid-cols-[4rem_1fr_1.2fr] sm:items-start sm:gap-8 sm:px-4">
              <span className="eyebrow text-white/55">{s.n}</span>
              <h3 className="font-display text-2xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/55">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Footer({ content }: { content: Content }) {
  const { site } = content;
  return (
    <footer className="overflow-hidden bg-ink px-6 pt-16 text-white sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/12 pb-10">
        <div>
          <p className="eyebrow text-white/55">Available for work</p>
          <p className="mt-2 max-w-sm text-lg leading-snug">
            {site.role} building production-shaped web applications.
          </p>
        </div>
        <ul className="flex flex-wrap gap-6 text-sm">
          <li>
            <a
              href={site.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              Upwork ↗
            </a>
          </li>
          <li>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              GitHub ↗
            </a>
          </li>
          <li>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-white"
            >
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              className="text-white/60 transition-colors hover:text-white"
            >
              Email ↗
            </a>
          </li>
        </ul>
      </div>

      <p className="display mt-10 text-center text-[19vw] leading-[0.8] text-white/90">
        {site.name}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 py-6 text-[0.7rem] uppercase tracking-[0.14em] text-white/55">
        <span>© 2026 {site.name}</span>
        <Link href="/admin" className="transition-colors hover:text-white/70">
          Admin
        </Link>
      </div>
    </footer>
  );
}
