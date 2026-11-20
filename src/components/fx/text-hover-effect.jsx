"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4: TextHoverEffect
// Giant full-width outlined wordmark sized clamp(90px,17vw,250px),
// outlined stroke with the hover gradient fill, aria-hidden, static under reduced motion.
export default function TextHoverEffect({ text = "EQUIPRA", className = "" }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "group relative flex w-full select-none items-center justify-center overflow-hidden py-2 leading-none",
        className,
      )}
    >
      <span
        style={{ fontSize: "clamp(90px, 17vw, 250px)" }}
        className="font-sans font-extrabold tracking-tighter text-transparent [-webkit-text-stroke:1.5px_var(--border-strong)] transition-colors"
      >
        {text}
      </span>

      {!reduced && (
        <span
          style={{ fontSize: "clamp(90px, 17vw, 250px)" }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans font-extrabold tracking-tighter bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          {text}
        </span>
      )}
    </div>
  );
}
