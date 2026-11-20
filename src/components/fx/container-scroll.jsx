"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4 ContainerScroll: useScroll({target}) -> rotateX 24°->0,
// scale 1.04->1 over first 45% of viewport; laptop-like frame rounded-[30px]
// border-[#404040] bg-[#1A1A1A] p-2.5. Static when prefers-reduced-motion is set.
export default function ContainerScroll({ children, className = "" }) {
  const containerRef = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.45], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [1.04, 1]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full items-center justify-center py-6 sm:py-10 [perspective:1000px]",
        className,
      )}
    >
      <motion.div
        style={
          reduced
            ? undefined
            : {
                rotateX,
                scale,
                transformStyle: "preserve-3d",
              }
        }
        className="w-full max-w-[1100px] rounded-[30px] border border-[#404040] bg-[#1A1A1A] p-2 sm:p-2.5 shadow-2xl transition-all"
      >
        {children}
      </motion.div>
    </div>
  );
}
