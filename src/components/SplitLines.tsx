"use client";

import { motion, useReducedMotion } from "framer-motion";

export type SplitLine = string | { text: string; tail?: string; dim?: boolean };

type Word = { text: string; dim: boolean };

function toWords(line: SplitLine): Word[] {
  const split = (value: string) => value.split(" ").filter(Boolean);

  if (typeof line === "string") {
    return split(line).map((text) => ({ text, dim: false }));
  }

  const head = split(line.text).map((text) => ({ text, dim: line.dim ?? false }));
  const tail = split(line.tail ?? "").map((text) => ({ text, dim: true }));
  return [...head, ...tail];
}

/**
 * Display type rises out of a mask, word by word, as it enters the viewport.
 * Words rather than characters: a per-letter stagger on 7rem type reads as
 * noise, and it would hand screen readers one letter at a time.
 *
 * The intersection observer sits on the clipping wrapper, not the moving word.
 * A word translated 118% below an `overflow-hidden` parent has a zero-area
 * intersection, so observing the word itself means it never fires.
 *
 * The wrapper keeps a little bottom padding and pulls it back with a negative
 * margin — `.display` runs at 0.86 line-height, so without it the mask would
 * shave the descenders off every word.
 */
export default function SplitLines({
  lines,
  as: Tag = "h2",
  className,
  dimClassName = "text-black/45",
  delay = 0,
}: {
  lines: SplitLine[];
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  dimClassName?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => {
        const words = toWords(line);
        return (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => (
              <motion.span
                key={`${word.text}-${wordIndex}`}
                className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                <motion.span
                  className={`inline-block ${word.dim ? dimClassName : ""}`}
                  variants={{
                    hidden: { y: "118%" },
                    show: {
                      y: "0%",
                      transition: reduced
                        ? { duration: 0 }
                        : {
                            duration: 0.95,
                            delay:
                              delay + (lineIndex * 2 + wordIndex) * 0.055,
                            ease: [0.22, 1, 0.36, 1],
                          },
                    },
                  }}
                >
                  {word.text}
                  {wordIndex < words.length - 1 ? "\u00A0" : ""}
                </motion.span>
              </motion.span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
