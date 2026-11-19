"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Spotlight({ className = "" }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute -left-1/4 top-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,106,43,0.13),transparent_70%)] blur-[120px]"
        animate={reduced ? undefined : { x: [0, 120, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(250,250,250,0.08),transparent_70%)] blur-[120px]"
        animate={reduced ? undefined : { x: [0, -120, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}
