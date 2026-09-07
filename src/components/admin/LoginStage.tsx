"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The animated half of the sign-in screen: three slow-drifting colour fields
 * under the Swiss grid, a marquee rail, and a clock — enough movement that the
 * page feels live without anything for the eye to fight while you type.
 */
export default function LoginStage({ name }: { name: string }) {
  const still = useReducedMotion();
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const blobs = [
    { color: "#d13a13", size: 620, from: "-10% 10%", to: ["-10% 10%", "25% 35%", "-5% 55%", "-10% 10%"] },
    { color: "#6366f1", size: 520, from: "70% 0%", to: ["70% 0%", "45% 40%", "80% 25%", "70% 0%"] },
    { color: "#0ea5e9", size: 460, from: "30% 80%", to: ["30% 80%", "65% 70%", "20% 60%", "30% 80%"] },
  ];

  return (
    <div className="relative isolate overflow-hidden bg-ink">
      {blobs.map((b, i) => (
        <motion.span
          key={b.color}
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            background: b.color,
            filter: "blur(120px)",
            opacity: 0.55,
            left: b.from.split(" ")[0],
            top: b.from.split(" ")[1],
          }}
          animate={
            still
              ? undefined
              : {
                  left: b.to.map((p) => p.split(" ")[0]),
                  top: b.to.map((p) => p.split(" ")[1]),
                }
          }
          transition={{ duration: 26 + i * 7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[25, 50, 75].map((top) =>
          [25, 50, 75].map((left) => (
            <span
              key={`${top}-${left}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-white/30"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>
          ))
        )}
      </div>

      <div className="relative flex min-h-[38svh] flex-col justify-between p-8 sm:p-12 lg:min-h-screen">
        <div className="flex items-start justify-between">
          <span className="font-display text-lg font-bold tracking-tight text-white">
            {name.split(" ")[0]}
            <sup className="ml-0.5 text-[0.6em] font-normal">®</sup>
          </span>
          <span className="eyebrow tabular-nums text-white/55" suppressHydrationWarning>
            {now ?? "--:--:--"}
          </span>
        </div>

        <div className="hidden lg:block">
          <motion.h2
            className="display text-[13vw] leading-[0.82] text-white/95 xl:text-[10rem]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Content
            <br />
            <span className="text-white/35">admin.</span>
          </motion.h2>
        </div>

        <div className="mt-8 overflow-hidden border-t border-white/15 pt-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className={still ? "flex gap-10" : "animate-marquee flex w-max gap-10"}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-[0.65rem] uppercase tracking-[0.24em] text-white/45"
              >
                Projects · Services · Site · Messages ·
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
