"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Counts the leading number in an admin-editable string ("10+", "100%") up from
 * zero the first time it is seen. The suffix is kept verbatim, and the real
 * value stays in the accessibility tree so a screen reader never hears "0+".
 */
export default function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  const parsed = /^(\d+)(.*)$/.exec(value);
  const target = parsed ? Number(parsed[1]) : null;
  const suffix = parsed ? parsed[2] : "";

  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => String(Math.round(v)));

  useEffect(() => {
    if (!inView || target === null) return;
    if (reduced) {
      count.set(target);
      return;
    }
    const controls = animate(count, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, target, reduced, count]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {target === null ? (
          value
        ) : (
          <>
            <motion.span className="tabular-nums">{shown}</motion.span>
            {suffix}
          </>
        )}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
