"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import "./fx.css";

// 03-DESIGN-SYSTEM.md §4 MovingBorder: a rotating conic gradient sitting
// behind a 1.5px padding, so only the ring shows. Wraps CTAs, the booking
// button and the NEW pill. Static when prefers-reduced-motion is set.
export default function MovingBorder({ className, children, ...props }) {
  const reduced = useReducedMotion();

  return (
    <span
      data-slot="moving-border"
      className={cn("relative inline-flex rounded-full p-[1.5px]", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "fx-moving-ring fx-ring-mask pointer-events-none absolute inset-0 rounded-full p-[1.5px]",
          !reduced && "fx-spin",
        )}
      />
      <span className="relative inline-flex">{children}</span>
    </span>
  );
}
