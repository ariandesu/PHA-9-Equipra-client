"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4 VanishInput: rotating placeholders (4 strings, 3 s)
// with y-slide; on submit navigate to /equipment?search=<term>.
// Semantic HTML: <form role="search"> with <label>.
export default function VanishInput({
  placeholders = [
    "Excavator near Gazipur…",
    "Cinema camera in Gulshan…",
    "Cargo van in Chattogram…",
    "Generator in Comilla…",
  ],
  onSubmit,
  className = "",
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (reduced || placeholders.length <= 1) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [reduced, placeholders.length]);

  function handleSubmit(e) {
    e.preventDefault();
    const clean = value.trim().slice(0, 60);

    if (onSubmit) {
      onSubmit(clean);
      return;
    }

    if (clean) {
      router.push(`/equipment?search=${encodeURIComponent(clean)}`);
    } else {
      router.push("/equipment");
    }
  }

  const currentPlaceholder =
    placeholders[placeholderIndex] ?? placeholders[0] ?? "";

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "relative flex h-[58px] sm:h-[62px] w-full max-w-[640px] items-center rounded-full border border-border bg-surface px-3 sm:px-4 shadow-sm transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15",
        className,
      )}
    >
      <Search
        aria-hidden="true"
        className="size-5 shrink-0 text-muted ml-1 mr-2 sm:mr-3"
      />

      <label htmlFor="hero-search" className="sr-only">
        Search equipment by name or location
      </label>

      <div className="relative flex-1">
        <input
          id="hero-search"
          type="text"
          value={value}
          maxLength={60}
          onChange={(e) => setValue(e.target.value)}
          className="relative z-10 w-full bg-transparent text-sm sm:text-base text-foreground placeholder-transparent outline-none"
        />

        {!value && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm sm:text-base text-muted"
          >
            {reduced ? (
              <span>{placeholders[0]}</span>
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPlaceholder}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {currentPlaceholder}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        aria-label="Search"
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>Search</span>
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </form>
  );
}
