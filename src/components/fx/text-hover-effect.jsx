"use client";

import { motion, useReducedMotion } from "motion/react";

export default function TextHoverEffect({ text = "EQUIPRA" }) {
  const reduced = useReducedMotion();

  return (
    <span className="group relative inline-block select-none">
      <span
        className="font-mono font-bold tracking-[0.2em] text-transparent [-webkit-text-stroke:1px_var(--border-strong)]"
        aria-hidden="true"
      >
        {text}
      </span>
      {!reduced && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-mono font-bold tracking-[0.2em] bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent opacity-0 transition-opacity group-hover:opacity-100"
        >
          {text}
        </span>
      )}
    </span>
  );
}
