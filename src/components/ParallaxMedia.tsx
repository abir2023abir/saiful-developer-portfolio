"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * A screenshot that drifts inside its frame as the page scrolls past. The image
 * is laid out 14% taller than the frame so the 7% travel never exposes an edge.
 *
 * Reduced motion is handled by `.parallax` in globals.css, not a
 * `useReducedMotion` branch: the server cannot know the preference, and
 * changing the style prop on the client would mismatch hydration.
 */
export default function ParallaxMedia({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div
      ref={ref}
      className="relative aspect-16/10 w-full overflow-hidden border border-black/10"
    >
      <motion.div
        className="parallax absolute inset-x-0 top-[-7%] h-[114%]"
        style={{ y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
