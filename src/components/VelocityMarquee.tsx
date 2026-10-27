"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/**
 * The tech strip. It drifts on its own, but scroll velocity feeds into it: it
 * accelerates as you scroll and turns around when you scroll back up, so the
 * page feels attached to the gesture. Two identical halves mean the loop can
 * wrap at -50% without a seam.
 */
export default function VelocityMarquee({ items }: { items: string[] }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), {
    damping: 50,
    stiffness: 400,
  });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-3.5, 0, 3.5], {
    clamp: false,
  });
  const skewX = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    // Reduced motion keeps the strip alive but deaf to the scroll — the owner
    // asked for it to keep moving, not to stop.
    let move = direction.current * (reduced ? 1.1 : 2.6) * (delta / 1000);
    const push = factor.get();
    if (push < 0) direction.current = -1;
    else if (push > 0) direction.current = 1;
    move *= 1 + Math.abs(push);
    baseX.set(baseX.get() + move);
  });

  return (
    <motion.div
      style={{ x, skewX }}
      className="flex w-max items-center will-change-transform"
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className="flex shrink-0 items-center"
          aria-hidden={copy === 1}
        >
          {items.map((name) => (
            <span
              key={`${copy}-${name}`}
              className="whitespace-nowrap pr-14 font-display text-xl font-bold tracking-tight text-black/45 sm:text-2xl"
            >
              {name}
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
