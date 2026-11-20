"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4: avatar stack with AnimatedTooltip
export default function AnimatedTooltip({ items = [], className = "" }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const reduced = useReducedMotion();

  return (
    <div className={cn("flex items-center -space-x-2.5", className)}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group outline-none"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onFocus={() => setHoveredIndex(idx)}
          onBlur={() => setHoveredIndex(null)}
          tabIndex={0}
          role="img"
          aria-label={item.name}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 8, scale: 0.9 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-md border border-border bg-foreground px-2.5 py-1 font-mono text-[11px] font-medium text-background shadow-xl"
              >
                {item.name}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{ backgroundColor: item.bg, color: item.text }}
            className="flex size-10 sm:size-11 items-center justify-center rounded-full border-2 border-background font-mono text-xs font-bold transition-transform group-hover:scale-110 group-hover:z-20 cursor-pointer shadow-md"
          >
            {item.initials}
          </div>
        </div>
      ))}
    </div>
  );
}
