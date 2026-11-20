"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4: Lamp + BackgroundBeams
// Two conic-gradient cones from a glowing line (width 15->30rem in view).
// Static when prefers-reduced-motion is set.
export default function LampContainer({ children, className = "" }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "relative isolate flex min-h-[460px] sm:min-h-[520px] flex-col items-center justify-center overflow-hidden bg-background w-full",
        className,
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left cone */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0.5, width: "15rem" }}
          whileInView={reduced ? undefined : { opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] bg-gradient-conic from-accent via-transparent to-transparent [--conic-position:from_70deg_at_center_top] opacity-50"
        >
          <div className="absolute w-full left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right cone */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0.5, width: "15rem" }}
          whileInView={reduced ? undefined : { opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-accent [--conic-position:from_290deg_at_center_top] opacity-50"
        >
          <div className="absolute w-40 h-full right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Backdrop and glow */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-accent opacity-30 blur-3xl" />

        <motion.div
          initial={reduced ? undefined : { width: "15rem" }}
          whileInView={reduced ? undefined : { width: "30rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-[30rem] -translate-y-[6rem] rounded-full bg-accent-2 opacity-20 blur-2xl"
        />

        {/* Top glowing line */}
        <motion.div
          initial={reduced ? undefined : { width: "15rem" }}
          whileInView={reduced ? undefined : { width: "30rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-background" />
      </div>

      <div className="relative z-50 -mt-24 flex flex-col items-center px-4">
        {children}
      </div>
    </div>
  );
}
