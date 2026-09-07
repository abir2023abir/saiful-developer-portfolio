"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export type NavLink = { label: string; href: string; count?: string };

export default function Nav({
  links,
  name,
  ready = true,
  variant = "overlay",
}: {
  links: NavLink[];
  name: string;
  ready?: boolean;
  variant?: "overlay" | "solid";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const overlay = variant === "overlay";

  const tone = overlay
    ? { text: "text-white", dim: "text-white", faint: "text-white/50", rule: "border-white/20", bar: "bg-white" }
    : { text: "text-ink", dim: "text-black/70", faint: "text-black/55", rule: "border-black/10", bar: "bg-ink" };

  return (
    <motion.header
      className={`${overlay ? "absolute" : "sticky border-b border-black/10 bg-paper/85 backdrop-blur"} inset-x-0 top-0 z-40 px-6 py-6 sm:px-10 ${overlay ? "sm:py-8" : "sm:py-5"}`}
      initial={{ opacity: 0, y: -20 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: overlay ? 0.1 : 0 }}
    >
      <div className={`flex items-center justify-between ${tone.text}`}>
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          {name.split(" ")[0]}
          <sup className="ml-0.5 text-[0.6em] font-normal">®</sup>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.label}
                href={l.href}
                className={`group relative text-sm transition-colors ${active ? tone.text : tone.dim} hover:${tone.text}`}
              >
                {l.label}
                {l.count && <sup className={`ml-1 text-[0.65em] ${tone.faint}`}>({l.count})</sup>}
                <span
                  className={`absolute -bottom-1 left-0 h-px ${tone.bar} transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-end justify-center gap-[6px] lg:hidden"
        >
          <span className={`block h-[2px] ${tone.bar} transition-all ${open ? "w-6 translate-y-[4px] rotate-45" : "w-7"}`} />
          <span className={`block h-[2px] ${tone.bar} transition-all ${open ? "w-6 -translate-y-[4px] -rotate-45" : "w-5"}`} />
        </button>

        <div className="hidden lg:block" aria-hidden>
          <span className={`block h-[2px] w-7 ${tone.bar}`} />
          <span className={`mt-[6px] block h-[2px] w-7 ${tone.bar}`} />
        </div>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`mt-6 flex flex-col gap-4 overflow-hidden border-t ${tone.rule} pt-6 lg:hidden`}
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`display text-3xl ${tone.text}`}
            >
              {l.label}
            </Link>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
}
