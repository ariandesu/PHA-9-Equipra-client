"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Nfc, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Drawn touchscreen device, 25em wide on a 10px base (250px at scale 1). Every
// inner dimension uses em, so the whole device scales with the `scale` prop.
// Cap 6.2em + body 33.9em + border 0.2em = 40.3em tall; the paper slot lip sits
// 5.9em below the outer top edge.
export const TERMINAL_WIDTH = 250;
export const TERMINAL_ASPECT = 40.3 / 25;
export const SLOT = { left: 6.4, right: 93.6, y: 14.6 };
export const SCREEN = { left: 10, top: 20.6, width: 80, height: 42.2 };

const STATUS_CONFIG = {
  idle: { bg: "#C2410C", label: "Processing…", pill: "Please wait", visual: "spinner" },
  confirming: { bg: "#C2410C", label: "Processing…", pill: "Printing receipt…", visual: "spinner" },
  confirmed: { bg: "#15803D", label: "Approved", pill: "Done", visual: "check" },
  error: { bg: "#B91C1C", label: "Declined", pill: "Try again", visual: "x" },
};

function ScreenVisual({ visual, bg, reduced, label }) {
  if (visual === "spinner") {
    return (
      <div
        aria-hidden="true"
        className="h-[2.8em] w-[2.8em] animate-spin rounded-full border-[0.3em] border-[rgba(255,255,255,0.25)] border-t-white motion-reduce:animate-none"
      />
    );
  }
  const Icon = visual === "check" ? Check : X;
  return (
    <motion.span
      key={label}
      initial={reduced ? false : { scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="flex h-[2.8em] w-[2.8em] items-center justify-center rounded-full bg-white"
    >
      <Icon className="h-[1.6em] w-[1.6em]" strokeWidth={3} style={{ color: bg }} />
    </motion.span>
  );
}

export default function POSTerminal({ status = "idle", scale = 1, amount = null }) {
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
      className="pos-device relative z-10"
      style={{ width: TERMINAL_WIDTH * scale, fontSize: 10 * scale }}
    >
      <div
        className={cn(
          "overflow-hidden rounded-[1.6em] border-[0.1em] border-[var(--pos-border)]",
          "bg-[var(--pos-body)] transition-colors duration-300 motion-reduce:transition-none"
        )}
        style={{ boxShadow: "var(--pos-shadow)" }}
      >
        {/* Printer cap */}
        <div className="relative h-[6.2em] bg-[var(--accent)]">
          <div aria-hidden="true" className="absolute left-1/2 top-[0.8em] h-[0.8em] w-[4em] -translate-x-1/2 rounded-full bg-[#C2410C]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-[4.9em] mx-auto h-[0.7em] w-[87.2%] rounded-[0.35em] bg-[#1A0A02]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-[5.6em] mx-auto h-[0.2em] w-[87.2%] rounded-full bg-[#FFB08A]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[0.1em] bg-[#C2410C]" />
        </div>

        {/* Body */}
        <div className="relative flex h-[33.9em] flex-col bg-[var(--pos-body)] px-[2.5em] pb-[1.8em] pt-[2em] transition-colors duration-300 motion-reduce:transition-none">
          <div aria-hidden="true" className="absolute left-[0.4em] top-[14em] h-[4.5em] w-[0.8em] rounded-full bg-[var(--accent)]" />
          <div aria-hidden="true" className="absolute right-[0.4em] top-[14em] h-[4.5em] w-[0.8em] rounded-full bg-[var(--accent)]" />

          {/* Screen */}
          <div className="h-[17em] shrink-0 rounded-[1em] bg-[#0A0A0A] p-[0.6em]">
            <div
              aria-hidden="true"
              style={{ backgroundColor: config.bg }}
              className="flex h-full w-full flex-col items-center justify-center gap-[0.5em] rounded-[0.6em] px-[1em] py-[0.8em] text-center transition-colors duration-300 motion-reduce:transition-none"
            >
              <div className="flex w-full items-center justify-between font-mono text-[0.9em] leading-none text-[rgba(255,255,255,0.92)]">
                <span>EQUIPRA PAY</span>
                <span className="flex gap-[0.3em]" aria-hidden="true">
                  <span className="h-[0.4em] w-[0.4em] rounded-full bg-[rgba(255,255,255,0.92)]" />
                  <span className="h-[0.4em] w-[0.4em] rounded-full bg-[rgba(255,255,255,0.92)]" />
                  <span className="h-[0.4em] w-[0.4em] rounded-full bg-[rgba(255,255,255,0.92)]" />
                </span>
              </div>
              {amount != null && (
                <div className="font-mono text-[2.4em] font-bold leading-none text-white">{amount}</div>
              )}
              <div className="text-[1.3em] font-semibold leading-tight text-white">{config.label}</div>
              <ScreenVisual visual={config.visual} bg={config.bg} reduced={reduced} label={config.label} />
              <div className="rounded-full bg-[rgba(255,255,255,0.18)] px-[1.4em] py-[0.5em] text-[1em] font-medium leading-tight text-white">
                {config.pill}
              </div>
            </div>
          </div>

          {/* Tap zone */}
          <div className="flex flex-1 flex-col items-center justify-center gap-[1em]">
            <Nfc aria-hidden="true" className="h-[2.6em] w-[2.6em] text-[var(--pos-nfc)]" />
            <div
              aria-hidden="true"
              className="mx-auto h-[3.6em] w-[5.4em] rounded-[0.6em] border-[0.15em] border-[var(--pos-chip-hi)] bg-[var(--pos-chip)] p-[0.5em] transition-colors duration-300 motion-reduce:transition-none"
            >
              <div className="relative h-full w-full">
                <div className="absolute inset-x-0 top-1/2 h-[0.15em] -translate-y-1/2 bg-[var(--pos-chip-hi)]" />
                <div className="absolute inset-y-0 left-1/2 w-[0.15em] -translate-x-1/2 bg-[var(--pos-chip-hi)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
