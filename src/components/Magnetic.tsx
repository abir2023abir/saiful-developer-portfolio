"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Pulls its child a few pixels toward the pointer and springs back on leave.
 * Disabled where hover is not a real input, so it never fires on touch.
 */
export default function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spring = { stiffness: 260, damping: 22, mass: 0.5 };
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
