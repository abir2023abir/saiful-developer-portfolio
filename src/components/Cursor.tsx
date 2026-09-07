"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A dot that follows the pointer and opens into a VIEW badge over anything
 * marked `data-cursor="view"`. Mounted only where a mouse actually exists —
 * on touch it would be a permanently stale artefact in the corner.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [over, setOver] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useSpring(useMotionValue(-100), { stiffness: 520, damping: 40, mass: 0.35 });
  const y = useSpring(useMotionValue(-100), { stiffness: 520, damping: 40, mass: 0.35 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setOver(Boolean(target?.closest?.('[data-cursor="view"]')));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white"
        animate={{ width: over ? 72 : 10, height: over ? 72 : 10 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <motion.span animate={{ opacity: over ? 1 : 0 }} transition={{ duration: 0.15 }}>
          View
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
