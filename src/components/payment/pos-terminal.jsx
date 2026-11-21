"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Measured in the committed asset (public/images/pos-terminal.webp, 374x600):
// the printer slot is the thin line at y≈21.2%, and the LCD occupies the box
// between those percentages.
export const TERMINAL_WIDTH = 220;
export const TERMINAL_ASPECT = 600 / 374;
export const SLOT = { left: 15.5, right: 91, y: 21.2 };
export const SCREEN = { left: 26, top: 32.1, width: 54.9, height: 17.2 };

const STATUS_CONFIG = {
  idle: { text: "READY", tone: "text-[#8a8a86]" },
  confirming: { text: "CONFIRMING…", tone: "text-[#f5f5f5]" },
  confirmed: { text: "APPROVED ✓", tone: "text-[#4ade80]" },
  error: { text: "DECLINED", tone: "text-[#f87171]" },
};

export default function POSTerminal({ status = "idle", scale = 1 }) {
  const reduced = useReducedMotion();
  const isConfirming = status === "confirming";
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const width = TERMINAL_WIDTH * scale;

  return (
    <motion.div
      animate={isConfirming && !reduced ? { y: [0, -2, 2, 0] } : { y: 0 }}
      transition={
        isConfirming && !reduced
          ? { duration: 0.14, repeat: Infinity, ease: "linear" }
          : { duration: 0.15 }
      }
      className="relative z-10"
      style={{ width: width }}
    >
      <Image
        src="/images/pos-terminal.webp"
        alt="Card payment terminal"
        width={374}
        height={600}
        priority
        sizes={`${Math.round(width)}px`}
        className={cn(
          "h-auto w-full select-none",
          "drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_18px_32px_rgba(0,0,0,0.65)]"
        )}
      />

      {/* LCD status, positioned over the photographed screen */}
      <div
        className="pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-[4px] bg-[#0A0A0A]"
        style={{
          left: `${SCREEN.left}%`,
          top: `${SCREEN.top}%`,
          width: `${SCREEN.width}%`,
          height: `${SCREEN.height}%`,
        }}
        aria-hidden="true"
      >
        <motion.span
          key={config.text}
          animate={
            isConfirming && !reduced ? { opacity: [1, 0.4, 1] } : { opacity: 1 }
          }
          transition={
            isConfirming && !reduced
              ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.15 }
          }
          className={cn(
            "px-1 text-center font-mono font-semibold leading-tight tracking-[0.06em]",
            config.tone
          )}
          style={{ fontSize: Math.max(7, 9 * scale) }}
        >
          {config.text}
        </motion.span>
      </div>
    </motion.div>
  );
}
