"use client";

import { motion, useReducedMotion } from "motion/react";

const paths = [
  "M0 40 Q 120 -20 240 40",
  "M60 60 Q 180 0 300 60",
  "M120 80 Q 240 20 360 80",
];

export default function BackgroundBeams({ className = "" }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full opacity-30"
        viewBox="0 0 360 160"
        fill="none"
        stroke="url(#beam)"
      >
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((path, i) => (
          <motion.path
            key={path}
            d={path}
            strokeWidth="1.5"
            strokeDasharray="120 320"
            initial={{ strokeDashoffset: 0 }}
            animate={reduced ? undefined : { strokeDashoffset: -440 }}
            transition={
              reduced
                ? undefined
                : {
                    duration: 6 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}
