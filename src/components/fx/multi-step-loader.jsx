"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function MultiStepLoader({
  steps,
  activeIndex = 0,
  intervalMs = 700,
}) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Reduced motion means no cycling; the caller controls the visible step.
    if (reduced) return undefined;

    const timer = setInterval(() => setTick((n) => n + 1), intervalMs);
    return () => clearInterval(timer);
  }, [reduced, intervalMs]);

  const current = reduced ? activeIndex : (activeIndex + tick) % steps.length;

  return (
    <div className="w-full max-w-md rounded-[22px] border border-border bg-surface p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        </span>
        <p className="text-lg font-semibold">Preparing your booking...</p>
      </div>
      <ol className="space-y-3">
        {steps.map((step, index) => {
          const done = index < current;
          return (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span
                className={`flex size-5 items-center justify-center rounded-full border ${
                  done
                    ? "border-success/25 bg-success/10 text-success"
                    : "border-border-strong text-subtle"
                }`}
                aria-hidden="true"
              >
                {done ? "✓" : ""}
              </span>
              <span className={done ? "text-foreground" : "text-muted"}>{step}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-6 h-1 w-full rounded-full bg-raised">
        <div
          className="h-1 rounded-full bg-primary transition-all"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
