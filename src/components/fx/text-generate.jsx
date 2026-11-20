"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4 TextGenerate: split words, stagger 0.045 s, from
// {opacity:0, filter:'blur(10px)'}. Static when prefers-reduced-motion is set.
export default function TextGenerate({ words = "", className = "" }) {
  const reduced = useReducedMotion();
  const wordArray = words.split(" ");

  if (reduced) {
    return <span className={className}>{words}</span>;
  }

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.045,
          },
        },
      }}
    >
      {wordArray.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)" },
            visible: { opacity: 1, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.25 }}
          className="inline-block"
        >
          {word}
          {i < wordArray.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
