"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "idle" | "link" | "view" | "text";

/**
 * Two rings chase the pointer at different springs, with a bead orbiting the
 * outer one. Over a project card it opens into a VIEW badge. Touch and
 * reduced-motion get the native cursor — a custom one would sit stale in
 * the corner, or keep moving when the person asked it not to.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-120);
  const y = useMotionValue(-120);

  const dotX = useSpring(x, { stiffness: 900, damping: 44, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 44, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.45 });
  const ghostX = useSpring(x, { stiffness: 78, damping: 16, mass: 0.85 });
  const ghostY = useSpring(y, { stiffness: 78, damping: 16, mass: 0.85 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      const hit = target?.closest?.(
        '[data-cursor="view"], a, button, [role="button"], summary, label, input, textarea, select, [contenteditable="true"]',
      );
      if (!hit) {
        setMode("idle");
        return;
      }
      if (hit.closest('[data-cursor="view"]')) setMode("view");
      else if (
        hit.matches("input, textarea, select, [contenteditable='true']")
      )
        setMode("text");
      else setMode("link");
    };
    const leave = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 88 : mode === "link" ? 54 : 18;
  const showChrome = visible && mode !== "text";

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-difference lg:block"
        style={{ x: ghostX, y: ghostY }}
        animate={{ opacity: showChrome ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80"
          animate={{
            width: size + 36,
            height: size + 36,
            scale: down ? 0.82 : 1,
          }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <motion.span
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute left-1/2 top-0 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </motion.span>
          <motion.span
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute bottom-0 left-1/2 block h-1 w-1 translate-y-1/2 -translate-x-1/2 rounded-full bg-white/80" />
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden lg:block"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: showChrome ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand bg-brand text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white"
          animate={{
            width: size,
            height: size,
            scale: down ? 0.9 : 1,
            backgroundColor: mode === "view" ? "var(--color-brand)" : "transparent",
          }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
        >
          <motion.span
            animate={{ opacity: mode === "view" ? 1 : 0, scale: mode === "view" ? 1 : 0.6 }}
            transition={{ duration: 0.18 }}
          >
            View
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[92] hidden mix-blend-difference lg:block"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible && mode !== "view" ? 1 : 0 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{
            width: mode === "link" ? 6 : 8,
            height: mode === "link" ? 6 : 8,
            scale: down ? 0.6 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </>
  );
}
