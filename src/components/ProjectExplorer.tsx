"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/types";

type Filter = { key: string; label: string; count: number };

/** "Next.js 16" and "Next.js 14" are one technology to a visitor. */
function tech(name: string): string {
  return name.replace(/\s+\d+(\.\d+)*$/, "").trim();
}

function keyOf(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9.+]+/g, "-");
}

/** Up to this many technologies get a chip; the rest are found by search. */
const TECH_CHIPS = 6;

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The full project list with filter chips and search. Cards that leave fade
 * out, the rest slide into the gaps, and the chip highlight glides between
 * filters. The choice is kept in the address bar, so a filtered view can be
 * shared and survives a reload.
 */
export default function ProjectExplorer({ projects }: { projects: Project[] }) {
  const filters = useMemo<Filter[]>(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const name of new Set(p.stack.map(tech))) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }
    const techs = [...counts]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, TECH_CHIPS)
      .map(([label, count]) => ({ key: keyOf(label), label, count }));

    const live = projects.filter((p) => p.liveUrl).length;
    return [
      { key: "all", label: "All", count: projects.length },
      ...(live ? [{ key: "live", label: "Live", count: live }] : []),
      ...techs,
    ];
  }, [projects]);

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const search = useRef<HTMLInputElement>(null);

  // The server renders the unfiltered list; the address bar is read after
  // hydration so both sides start from the same markup.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("filter");
    const q = params.get("q");
    if (f && filters.some((x) => x.key === f)) setFilter(f);
    if (q) setQuery(q);
  }, [filters]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", filter);
    if (deferredQuery.trim()) url.searchParams.set("q", deferredQuery.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url);
  }, [filter, deferredQuery]);

  // "/" jumps to the search field, as on most sites with one.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      search.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const shown = useMemo(() => {
    const words = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean);
    return projects
      .map((project, index) => ({ project, index }))
      .filter(({ project: p }) => {
        if (filter === "live" && !p.liveUrl) return false;
        if (
          filter !== "all" &&
          filter !== "live" &&
          !p.stack.some((s) => keyOf(tech(s)) === filter)
        )
          return false;
        if (!words.length) return true;
        const text = [p.title, p.category, p.summary, p.year, ...p.stack]
          .join(" ")
          .toLowerCase();
        return words.every((w) => text.includes(w));
      });
  }, [projects, filter, deferredQuery]);

  const active = filters.find((f) => f.key === filter) ?? filters[0];

  function reset() {
    setFilter("all");
    setQuery("");
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-6 border-y border-black/10 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter projects"
          className="flex flex-wrap gap-2"
        >
          {filters.map((f) => {
            const on = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.key)}
                className={`eyebrow relative border px-4 py-2.5 transition-colors duration-300 ${
                  on
                    ? "border-ink text-white"
                    : "border-black/15 text-black/65 hover:border-ink hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden
                  />
                )}
                <span className="relative inline-flex items-center gap-2">
                  {f.key === "live" && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-brand"
                      aria-hidden
                    />
                  )}
                  {f.label}
                  <span className={on ? "text-white/60" : "text-black/40"}>
                    {String(f.count).padStart(2, "0")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <label className="group relative flex items-center gap-3 border-b border-black/20 pb-2 transition-colors focus-within:border-ink lg:w-72">
          <span className="sr-only">Search projects</span>
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 shrink-0 text-black/45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
          >
            <circle cx="7" cy="7" r="5" />
            <path d="m11 11 3.5 3.5" />
          </svg>
          <input
            ref={search}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, stack, type"
            className="w-full bg-transparent text-sm outline-none placeholder:text-black/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                search.current?.focus();
              }}
              className="eyebrow shrink-0 text-black/55 hover:text-ink"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden shrink-0 border border-black/15 px-1.5 text-[0.65rem] text-black/45 sm:inline">
              /
            </kbd>
          )}
        </label>
      </div>

      <p className="eyebrow mt-6 flex items-center gap-2 text-black/55" aria-live="polite">
        <span>Showing</span>
        <span className="relative inline-block overflow-hidden text-ink">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shown.length}
              className="inline-block"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.35, ease }}
            >
              {String(shown.length).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </span>
        <span>
          of {String(projects.length).padStart(2, "0")}
          {active.key !== "all" && ` · ${active.label}`}
          {deferredQuery.trim() && ` · “${deferredQuery.trim()}”`}
        </span>
      </p>

      <motion.div layout className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map(({ project, index }) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {shown.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="border border-dashed border-black/20 px-6 py-20 text-center"
          >
            <p className="display text-[9vw] leading-[0.9] sm:text-[3rem]">
              Nothing here
              <span className="text-black/35"> yet.</span>
            </p>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-black/60">
              No project matches that search. Try a broader word, or see
              everything.
            </p>
            <button
              type="button"
              onClick={reset}
              className="group mt-8 inline-flex items-center gap-3 border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-white"
            >
              Show all projects
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
