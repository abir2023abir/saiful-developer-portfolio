"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";

type Mode = "idle" | "link" | "view" | "text";

/** A brand dot that arrives late, so a fast mouse leaves a visible trail. */
function TrailDot({
  x,
  y,
  stiffness,
  size,
  visible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  stiffness: number;
  size: number;
  visible: boolean;
}) {
  const sx = useSpring(x, { stiffness, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness, damping: 22, mass: 0.6 });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[89]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 0.9 : 0 }}
    >
      <span
        className="block -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
}

/**
 * A dot, a lagging ring and a short trail follow the pointer. Over a project
 * card the ring opens into a VIEW badge. Touch keeps the system cursor — a
 * custom one would sit stale in the corner.
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
    const fine = window.matchMedia("(pointer: fine)").matches;
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

  const trail = visible && mode !== "text";

  return (
    <>
      <TrailDot x={x} y={y} stiffness={180} size={10} visible={trail} />
      <TrailDot x={x} y={y} stiffness={120} size={8} visible={trail} />
      <TrailDot x={x} y={y} stiffness={70} size={6} visible={trail} />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
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
        className="pointer-events-none fixed left-0 top-0 z-[91]"
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
        className="pointer-events-none fixed left-0 top-0 z-[92] mix-blend-difference"
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
