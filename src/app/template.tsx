"use client";

import { motion } from "framer-motion";

/**
 * Every route fades in under the nav. Opacity only — a transform here would
 * become the containing block for the preloader and every other fixed element
 * inside the page, which is a silent way to break them.
 *
 * Deliberately not gated on `useReducedMotion`: the server cannot know the
 * preference, so branching here mismatches hydration for those users. A short
 * opacity fade is also the one kind of motion that stays comfortable.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
