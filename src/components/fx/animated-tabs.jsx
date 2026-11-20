"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §4 AnimatedTabs: layoutId="tab-pill" background,
// spring { bounce: 0.3, duration: 0.6 }.
// Real accessible tablist with role="tab", aria-selected, tabIndex and
// arrow-key navigation. Static under useReducedMotion.
export default function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  panelId = "featured-panel",
  className = "",
}) {
  const reduced = useReducedMotion();
  const tabRefs = useRef([]);

  function handleKeyDown(event, index) {
    let nextIndex = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      onChange(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "flex w-fit max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-border bg-surface p-1.5 scrollbar-none",
        className,
      )}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-controls={panelId}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "relative z-10 shrink-0 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
              isActive
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {isActive &&
              (reduced ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full border border-border-strong bg-raised"
                />
              ) : (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full border border-border-strong bg-raised"
                />
              ))}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
