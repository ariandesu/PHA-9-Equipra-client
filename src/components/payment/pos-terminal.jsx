"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

const STATUS_CONFIG = {
  idle: { text: "READY", tone: "text-muted" },
  confirming: { text: "CONFIRMING…", tone: "text-foreground" },
  confirmed: { text: "APPROVED ✓", tone: "text-success" },
  error: { text: "DECLINED", tone: "text-danger" },
};

export default function POSTerminal({ status = "idle" }) {
  const reduced = useReducedMotion();
  const isConfirming = status === "confirming";
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  return (
    <motion.div
      animate={isConfirming && !reduced ? { y: [0, -2, 2, 0] } : { y: 0 }}
      transition={
        isConfirming && !reduced
          ? { duration: 0.14, repeat: Infinity, ease: "linear" }
          : { duration: 0.15 }
      }
      className={cn(
        "relative z-10 mx-auto flex w-[260px] flex-col items-center gap-3.5 rounded-[20px] border border-border",
        "bg-raised dark:bg-[#161616] px-4 pt-4 pb-2.5 shadow-2xl"
      )}
    >
      {/* Screen strip — kept dark so LCD status colors stay crisp in both themes */}
      <div className="dark flex h-11 w-full items-center justify-center rounded-[10px] border border-border bg-[#0A0A0A] px-3">
        <motion.span
          key={config.text}
          animate={
            isConfirming && !reduced ? { opacity: [1, 0.45, 1] } : { opacity: 1 }
          }
          transition={
            isConfirming && !reduced
              ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.15 }
          }
          className={cn("font-mono text-xs font-semibold tracking-[0.14em]", config.tone)}
        >
          {config.text}
        </motion.span>
      </div>

      {/* 3x4 decorative keypad */}
      <div className="grid w-full grid-cols-3 gap-1.5 px-2" aria-hidden="true">
        {KEYS.flat().map((key) => (
          <span
            key={key}
            className="flex h-5 items-center justify-center rounded-[5px] border border-border/80 bg-background/80 dark:bg-[#222222] font-mono text-[10px] text-muted"
          >
            {key}
          </span>
        ))}
      </div>

      {/* Paper slot along the bottom edge */}
      <div
        aria-hidden="true"
        className="mt-0.5 h-2 w-[244px] max-w-full rounded-full bg-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"
      />
    </motion.div>
  );
}
