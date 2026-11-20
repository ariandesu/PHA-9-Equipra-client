"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import "@/components/fx/fx.css";

const METEOR_STYLES = [
  { top: "12%", left: "18%", delay: "0.2s", duration: "4.5s" },
  { top: "25%", left: "42%", delay: "1.1s", duration: "3.8s" },
  { top: "8%", left: "65%", delay: "0.7s", duration: "5.2s" },
  { top: "34%", left: "82%", delay: "1.9s", duration: "4.1s" },
  { top: "45%", left: "15%", delay: "2.4s", duration: "3.5s" },
  { top: "58%", left: "38%", delay: "0.5s", duration: "4.8s" },
  { top: "22%", left: "75%", delay: "1.4s", duration: "5.0s" },
  { top: "68%", left: "55%", delay: "2.1s", duration: "4.3s" },
  { top: "15%", left: "90%", delay: "0.9s", duration: "3.9s" },
  { top: "72%", left: "25%", delay: "1.6s", duration: "4.7s" },
  { top: "38%", left: "48%", delay: "2.8s", duration: "3.6s" },
  { top: "52%", left: "85%", delay: "0.3s", duration: "5.4s" },
];

export default function Meteors({ className = "" }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {METEOR_STYLES.map((style, idx) => (
        <span
          key={`meteor-${idx}`}
          className="fx-meteor"
          style={{
            top: style.top,
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        />
      ))}
    </div>
  );
}
