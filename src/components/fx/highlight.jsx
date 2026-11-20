"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4 Highlight: motion.span animating backgroundSize 0%->100%
// after 1.6 s, orange 28% gradient. Static when prefers-reduced-motion is set.
export default function Highlight({ children, className = "" }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <span
        className={cn(
          "inline-block rounded-lg px-2 py-0.5 text-foreground bg-[linear-gradient(90deg,rgba(255,106,43,0.28),rgba(255,184,107,0.28))]",
          className,
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{
        duration: 0.8,
        delay: 1.6,
        ease: "easeOut",
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        backgroundImage:
          "linear-gradient(90deg, rgba(255,106,43,0.28), rgba(255,184,107,0.28))",
      }}
      className={cn("inline-block rounded-lg px-2 py-0.5 text-foreground", className)}
    >
      {children}
    </motion.span>
  );
}
