"use client";

import { motion, useReducedMotion } from "motion/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4: AnimatedModal with initial={{scale:.6, rotateX:30, y:40, opacity:0}} spring
export default function AnimatedModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
}) {
  const reduced = useReducedMotion();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-4xl p-0 overflow-hidden border-border bg-surface rounded-[24px] shadow-2xl [perspective:1200px]",
          className,
        )}
      >
        <DialogTitle className="sr-only">{title || "Dialog"}</DialogTitle>
        <DialogDescription className="sr-only">
          {description || "Dialog content"}
        </DialogDescription>
        <motion.div
          initial={
            reduced
              ? undefined
              : { scale: 0.6, rotateX: 30, y: 40, opacity: 0 }
          }
          animate={
            reduced ? undefined : { scale: 1, rotateX: 0, y: 0, opacity: 1 }
          }
          exit={
            reduced
              ? undefined
              : { scale: 0.8, rotateX: 20, y: 30, opacity: 0 }
          }
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
