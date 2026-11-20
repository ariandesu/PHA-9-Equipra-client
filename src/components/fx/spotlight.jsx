"use client";

import { motion, useReducedMotion } from "motion/react";

// 03-DESIGN-SYSTEM.md §4 Spotlight: two absolutely-positioned blurred
// radial-gradient ellipses (orange 13% / white 8%) rotated ±45°, animating
// x: [0, 120, 0] over 9 s, mirrored. Static when prefers-reduced-motion.
// The rotation lives on a wrapper so motion's inline transform on the inner
// blob does not clobber it.
export default function Spotlight({ className = "" }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="absolute -left-1/4 top-0 rotate-45">
        <motion.div
          className="h-[36rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,106,43,0.13),transparent_70%)] blur-[120px]"
          animate={reduced ? undefined : { x: [0, 120, 0] }}
          transition={
            reduced
              ? undefined
              : { duration: 9, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>
      <div className="absolute -right-1/4 bottom-0 -rotate-45">
        <motion.div
          className="h-[32rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(250,250,250,0.08),transparent_70%)] blur-[120px]"
          animate={reduced ? undefined : { x: [0, -120, 0] }}
          transition={
            reduced
              ? undefined
              : { duration: 9, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>
    </div>
  );
}
