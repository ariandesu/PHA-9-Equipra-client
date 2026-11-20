"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import "./fx.css";

// 03-DESIGN-SYSTEM.md §4 GlowCard: hover conic-gradient border spin, a
// rotateX(5deg) rotateY(-4deg) lift of 6px and an inner radial spotlight.
// Static when prefers-reduced-motion is set.
export default function GlowCard({ className, children, ...props }) {
  const reduced = useReducedMotion();

  return (
    <div
      data-slot="glow-card"
      className={cn(
        "group/glow relative isolate flex flex-col rounded-[22px] border border-border bg-surface transition-transform duration-300 ease-out",
        !reduced &&
          "hover:[transform:perspective(900px)_rotateX(5deg)_rotateY(-4deg)_translateY(-6px)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "fx-glow-ring fx-ring-mask pointer-events-none absolute inset-0 -z-10 rounded-[22px] p-px opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100 group-focus-within/glow:opacity-100",
          !reduced && "fx-spin-on-hover",
        )}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[22px] bg-[radial-gradient(60%_55%_at_50%_0%,var(--accent),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-10"
      />
      {children}
    </div>
  );
}
