"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef } from "react";

/**
 * A hairline rail on the right edge with the percentage read out beside it.
 * `mix-blend-difference` is what lets one element stay legible over the orange
 * hero, the paper sections and the ink footer without a single conditional.
 */
export default function ScrollRail() {
  const path = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const percent = useTransform(progress, (v) =>
    String(Math.round(v * 100)).padStart(3, "0"),
  );

  // Written straight to the node: a scroll readout does not need a React
  // render on every frame.
  const readout = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(percent, "change", (value) => {
    if (readout.current) readout.current.textContent = value;
  });

  if (path.startsWith("/admin")) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-5 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 text-white mix-blend-difference lg:flex"
    >
      <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
      <span className="relative block h-40 w-px bg-white/30">
        <motion.span
          className="absolute inset-x-0 top-0 block h-full origin-top bg-white"
          style={{ scaleY: progress }}
        />
      </span>
      <span
        ref={readout}
        className="eyebrow tabular-nums [writing-mode:vertical-rl]"
      >
        000
      </span>
    </div>
  );
}
