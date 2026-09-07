"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Magnetic from "./Magnetic";
import Nav, { type NavLink } from "./Nav";
import type { Content } from "@/lib/types";

export default function Hero({
  content,
  links,
  ready,
}: {
  content: Content;
  links: NavLink[];
  ready: boolean;
}) {
  const { site, projects } = content;
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const show = ready ? { opacity: 1, y: 0 } : {};

  // The wordmark drifts faster than the portrait across the first viewport, so
  // the head appears to rise out of it as you scroll.
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={section}
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-brand"
    >
      {/* Swiss grid: hairlines plus a crosshair at every intersection. */}
      <div
        className="grid-lines pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[25, 50, 75].map((top) =>
          [25, 50, 75].map((left) => (
            <span
              key={`${top}-${left}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-white/55"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 0v14M0 7h14"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </span>
          )),
        )}
      </div>

      <Nav links={links} name={site.name} ready={ready} variant="overlay" />

      {/* Ghosted wordmark sitting behind the portrait. */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[13%] z-0 flex justify-center"
        style={{ y: wordmarkY }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        <span className="display whitespace-nowrap text-[27vw] text-white/[0.16]">
          {site.name.split(" ")[0]}
        </span>
      </motion.div>

      {/* Portrait, bottom-anchored so the head breaks above the wordmark. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 flex justify-center"
        style={{ y: portraitY }}
        initial={{ opacity: 0, y: 60 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/hero-portrait.png"
          alt={`${site.name}, ${site.role}`}
          width={1664}
          height={1870}
          priority
          sizes="(max-width: 768px) 130vw, 92vh"
          className="h-auto w-[112vw] max-w-none translate-x-[4vw] object-contain sm:h-[min(80svh,76vw)] sm:w-auto sm:translate-x-0"
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="absolute left-6 top-[38%] z-20 max-w-[13rem] text-[0.68rem] font-medium uppercase leading-relaxed tracking-[0.06em] text-white sm:left-10 sm:max-w-xs sm:text-xs"
        initial={{ opacity: 0, y: 28 }}
        animate={show}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {site.tagline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </motion.p>

      {/* Hire-me link straight through to Upwork. */}
      <motion.a
        href={site.upwork}
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute left-6 top-[54%] z-30 inline-flex items-center gap-2 bg-ink px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition-colors hover:bg-white hover:text-ink sm:left-10"
        initial={{ opacity: 0, y: 28 }}
        animate={show}
        transition={{ duration: 0.9, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        Hire me on Upwork
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          ↗
        </span>
      </motion.a>

      {/* Name across the bottom, in front of the portrait. */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 sm:px-10 sm:pb-8">
        <motion.span
          className="eyebrow mb-1 block text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={show}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          ©2026
        </motion.span>
        <motion.h1
          className="display whitespace-nowrap text-[10.5vw] leading-[0.82] text-white sm:text-[12vw]"
          initial={{ opacity: 0, y: 90 }}
          animate={show}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {site.name}
        </motion.h1>
      </div>

      {/* Featured project chip */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={show}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-6 top-[36%] z-30 hidden w-52 sm:right-10 lg:block"
        >
          <Magnetic strength={0.22}>
            <Link
              data-cursor="view"
              href={`/work/${featured.slug}`}
              className="block border border-white/70 bg-white p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_26px_60px_rgba(0,0,0,0.28)]"
            >
              <span className="relative block h-28 w-full overflow-hidden">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    sizes="208px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="block h-full w-full"
                    style={{
                      background: `linear-gradient(135deg, ${featured.tint[0]}, ${featured.tint[1]})`,
                    }}
                  />
                )}
              </span>
              <span className="flex items-center justify-between px-1.5 py-2 text-[0.65rem] font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span className="text-brand-ink">✳</span>
                  {featured.title}
                </span>
                <span className="text-black/55">
                  /{featured.category.split(" ")[0]}
                </span>
              </span>
            </Link>
          </Magnetic>
        </motion.div>
      )}

      {/* Let's talk card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={show}
        transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-28 right-6 z-30 hidden w-60 sm:right-10 lg:block"
      >
        <Magnetic strength={0.22}>
          <Link
            href="/contact"
            className="flex items-center gap-3 bg-ink p-2 text-white transition-shadow hover:shadow-[0_20px_44px_rgba(0,0,0,0.3)]"
          >
            {/* Punched in on the face — the whole cut-out at 48px would read as a blob. */}
            <span
              aria-hidden
              className="h-12 w-12 shrink-0 bg-brand"
              style={{
                backgroundImage: "url(/images/hero-portrait.png)",
                backgroundSize: "150%",
                backgroundPosition: "22% 6%",
              }}
            />
            <span className="flex-1 leading-tight">
              <span className="block text-[0.6rem] uppercase tracking-[0.16em] text-white/55">
                Let&apos;s talk
              </span>
              <span className="block text-sm font-semibold">{site.name}</span>
              <span className="block text-[0.65rem] text-white/60">
                {site.role}
              </span>
            </span>
            <span className="grid h-7 w-7 place-items-center border border-white/25 text-xs">
              ↗
            </span>
          </Link>
        </Magnetic>
      </motion.div>
    </section>
  );
}
