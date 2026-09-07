"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

/**
 * Single-stroke cursive "hello", drawn the way Apple draws it on first boot:
 * one continuous path, monoline, written left to right.
 */
const HELLO =
  "M118 330 C112 240 130 140 168 90 C186 66 208 62 208 96 C208 136 176 186 150 232 " +
  "C130 270 120 300 122 332 C128 292 152 240 190 238 C216 236 226 260 218 288 " +
  "C212 308 206 320 212 330 C220 342 246 340 262 318 C276 296 288 268 276 254 " +
  "C266 242 246 250 240 276 C234 302 246 326 272 330 C292 333 306 322 318 306 " +
  "C336 268 360 190 372 130 C380 90 384 66 372 64 C358 62 352 110 352 160 " +
  "C352 230 358 290 372 320 C380 338 400 336 414 318 C432 280 456 196 468 136 " +
  "C476 96 480 70 468 68 C454 66 448 114 448 164 C448 234 454 294 468 324 " +
  "C476 342 498 340 514 320 C526 296 542 268 566 264 C592 260 606 284 602 310 " +
  "C598 334 578 344 560 336 C544 329 538 310 550 292 C562 272 588 268 606 282";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(true);
  const count = useMotionValue(0);
  const label = useTransform(count, (v) =>
    String(Math.round(v)).padStart(3, "0"),
  );
  const progress = useTransform(count, (v) => `${v}%`);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(quick);

    document.body.style.overflow = "hidden";
    const controls = animate(count, 100, {
      duration: quick ? 0.4 : 2.6,
      ease: [0.22, 0.85, 0.24, 1],
    });

    const timer = window.setTimeout(
      () => {
        setOpen(false);
        document.body.style.overflow = "";
        onDone();
      },
      quick ? 700 : 3300,
    );

    return () => {
      controls.stop();
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [count, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 sm:px-12 sm:py-12"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="eyebrow flex items-center justify-between text-white/55">
            <span>Saiful Islam</span>
            <span className="hidden sm:inline">Full Stack Web Developer</span>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <svg
              viewBox="0 0 700 420"
              className="w-[min(78vw,620px)]"
              fill="none"
              aria-label="hello"
              role="img"
            >
              <motion.path
                d={HELLO}
                stroke="#ffffff"
                strokeWidth={15}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                initial={{ strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: reduced ? 0.3 : 2.3,
                  delay: reduced ? 0 : 0.25,
                  ease: [0.33, 0.1, 0.2, 1],
                }}
                style={{ strokeDasharray: 1 }}
              />
            </svg>
          </div>

          <div className="flex items-end justify-between">
            <motion.span
              className="eyebrow max-w-[14rem] text-white/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Loading the work
            </motion.span>
            <motion.span className="display text-white text-[18vw] leading-[0.8] sm:text-[9rem]">
              {label}
            </motion.span>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-brand"
            style={{ width: progress }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
