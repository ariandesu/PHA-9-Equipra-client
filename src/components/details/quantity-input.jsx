"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuantityInput({ id, value, min = 1, max, onChange }) {
  const reduced = useReducedMotion();
  const inputRef = useRef(null);
  const [animated, setAnimated] = useState(true);
  const [caretOn, setCaretOn] = useState(true);

  const clamp = (next) => Math.min(max, Math.max(min, next));

  const handleInput = (event) => {
    const el = event.currentTarget;
    setAnimated(false);
    if (el.value === "") {
      onChange(min);
      return;
    }
    const next = parseInt(el.value, 10);
    if (Number.isNaN(next) || next < min || next > max) return;
    onChange(next);
    el.value = String(next);
  };

  const focusInput = (event) => {
    if (event.pointerType === "mouse") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  const step = (delta) => {
    setAnimated(true);
    const next = clamp(value + delta);
    if (inputRef.current) inputRef.current.value = String(next);
    onChange(next);
  };

  const buttonClass = "flex size-7 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface disabled:opacity-40";

  return (
    <div className="flex h-9 items-center gap-0.5 rounded-[10px] border border-border bg-raised px-1 focus-within:ring-2 focus-within:ring-primary">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        disabled={value <= min}
        onPointerDown={focusInput}
        onClick={() => step(-1)}
        className={buttonClass}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <div className="grid font-mono text-sm font-semibold text-foreground [grid-template-areas:'overlap']">
        <input
          ref={inputRef}
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          autoComplete="off"
          defaultValue={value}
          onChange={handleInput}
          style={{ fontKerning: "none" }}
          className={cn(
            "spin-hide w-[3ch] bg-transparent text-transparent outline-none [grid-area:overlap]",
            caretOn ? "caret-primary" : "caret-transparent"
          )}
        />
        <NumberFlow
          value={value}
          locales="en-US"
          format={{ useGrouping: false }}
          aria-hidden="true"
          animated={reduced ? false : animated}
          willChange
          className="pointer-events-none [grid-area:overlap]"
          onAnimationsStart={() => setCaretOn(false)}
          onAnimationsFinish={() => setCaretOn(true)}
        />
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        disabled={value >= max}
        onPointerDown={focusInput}
        onClick={() => step(1)}
        className={buttonClass}
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
