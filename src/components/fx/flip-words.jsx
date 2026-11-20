"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4 FlipWords: AnimatePresence mode="wait"; words cycle
// every 2.5 s; enter {opacity:0,y:20,filter:'blur(8px)'} exit
// {opacity:0,y:-40,scale:1.6,filter:'blur(10px)'}; gradient orange text.
// When prefers-reduced-motion is set, renders static first word.
export default function FlipWords({
  words = ["excavators"],
  duration = 2500,
  className = "",
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [reduced, words.length, duration]);

  const currentWord = words[index] ?? words[0];

  if (reduced) {
    return (
      <span
        className={cn(
          "inline-block bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent",
          className,
        )}
      >
        {words[0]}
      </span>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentWord}
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -40, scale: 1.6, filter: "blur(10px)" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={cn(
          "inline-block bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent",
          className,
        )}
      >
        {currentWord}
      </motion.span>
    </AnimatePresence>
  );
}
