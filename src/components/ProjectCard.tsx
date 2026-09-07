"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";

/**
 * The card tilts toward the pointer and lifts the screenshot behind a moving
 * sheen. Everything is spring-damped so a fast mouse cannot make it snap.
 */
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 26, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), spring);
  const lift = useSpring(useMotionValue(0), spring);

  const sheenX = useTransform(px, [0, 1], ["0%", "100%"]);
  const sheen = useMotionTemplate`radial-gradient(30% 60% at ${sheenX} 50%, rgba(255,255,255,0.30), transparent 70%)`;

  function track(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.85, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full [perspective:1200px]"
    >
      <motion.div
        onPointerMove={track}
        onPointerEnter={() => lift.set(-10)}
        onPointerLeave={() => {
          lift.set(0);
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY, y: lift, transformStyle: "preserve-3d" }}
      >
        <Link
          data-cursor="view"
          href={`/work/${project.slug}`}
          className="block overflow-hidden border border-black/10 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
        >
          <div className="relative aspect-16/11 overflow-hidden">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, 45vw"
                className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
            ) : (
              /* No screenshot yet — a drawn panel rather than a broken image. */
              <div
                className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                style={{
                  background: `linear-gradient(140deg, ${project.tint[0]} 0%, ${project.tint[1]} 100%)`,
                }}
              >
                <div className="grid-lines absolute inset-0 opacity-40" />
                <span className="display absolute bottom-4 left-5 text-[3.2rem] leading-none text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            )}

            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: sheen }}
            />

            <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center bg-white text-sm opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
              ↗
            </span>

            <span className="absolute bottom-0 left-0 h-1 w-0 bg-brand transition-[width] duration-700 ease-out group-hover:w-full" />
          </div>

          <div className="flex items-baseline justify-between gap-4 border-t border-black/10 px-5 py-4">
            <h3 className="font-display text-xl font-bold tracking-tight">{project.title}</h3>
            <span className="eyebrow shrink-0 text-black/55">{project.year}</span>
          </div>
        </Link>
      </motion.div>

      <p className="eyebrow mt-4 text-brand-ink">{project.category}</p>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-black/60">{project.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <li
            key={s}
            className="border border-black/15 px-2.5 py-1 text-[0.68rem] uppercase tracking-wider text-black/55 transition-colors group-hover:border-brand/40"
          >
            {s}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
