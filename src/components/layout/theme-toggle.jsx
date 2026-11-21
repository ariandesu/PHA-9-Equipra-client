"use client";

import { useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

function useMounted() {
  // Renders false during SSR and the hydration pass, then true. Unlike a
  // useEffect + setState flag this does not trip react-hooks/set-state-in-effect.
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// Apply the class synchronously: next-themes applies it in an effect, which is
// too late for the view-transition snapshot (it would capture the old theme).
function applyTheme(next, setTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", next === "dark");
  root.style.colorScheme = next;
  flushSync(() => setTheme(next));
}

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const buttonRef = useRef(null);
  const transitionRef = useRef(false);

  function handleClick() {
    if (transitionRef.current) return;
    const next = isDark ? "light" : "dark";

    if (!document.startViewTransition || reduced || !buttonRef.current) {
      applyTheme(next, setTheme);
      return;
    }

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    transitionRef.current = true;
    const transition = document.startViewTransition(() => applyTheme(next, setTheme));

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
    transition.finished.then(() => {
      transitionRef.current = false;
    });
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={handleClick}
      className="flex size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-raised hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/15"
    >
      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            className="flex items-center justify-center"
            initial={reduced ? false : { rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={reduced ? undefined : { rotate: 90, scale: 0.6, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            {isDark ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
