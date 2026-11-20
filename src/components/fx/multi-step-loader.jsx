"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/components/fx/fx.css";

const DEFAULT_STEPS = [
  "Checking availability for 21–23 Nov",
  "Calculating total · ৳55,500",
  "Creating Stripe Checkout session",
  "Redirecting to secure payment",
  "Confirming booking",
];

// Screen 08 (left): branded loading card with dot background, orange gradient
// logo tile with spinning loader, title, steps checklist and gradient progress bar.
export default function MultiStepLoader({
  steps = DEFAULT_STEPS,
  title = "Preparing your booking…",
  kicker = "LOADING · MULTI STEP LOADER",
  activeIndex = 2,
  intervalMs = 700,
  className = "",
}) {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(activeIndex);

  useEffect(() => {
    if (reduced) return undefined;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [reduced, intervalMs, steps.length]);

  const stepIndex = reduced ? activeIndex : current;
  const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-[22px] border border-border bg-surface p-6 sm:p-8 shadow-2xl",
        className,
      )}
    >
      {/* Dot-grid background */}
      <div
        aria-hidden="true"
        className="fx-dots pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative z-10 flex flex-col">
        {/* Kicker */}
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-6">
          {kicker}
        </p>

        {/* Title row with orange gradient tile */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-accent to-accent-2 text-primary-foreground shadow-lg shadow-accent/20">
            <Loader2
              className={cn("size-6", !reduced && "animate-spin")}
              aria-hidden="true"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        {/* Steps checklist */}
        <ol className="space-y-3.5">
          {steps.map((step, idx) => {
            const isDone = idx <= stepIndex;
            return (
              <li key={step} className="flex items-center gap-3 text-sm">
                {isDone ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="size-5 shrink-0 rounded-full border border-border" />
                )}
                <span
                  className={
                    isDone ? "text-foreground font-medium" : "text-muted"
                  }
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Gradient progress bar */}
        <div className="mt-7 h-1 w-full overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
