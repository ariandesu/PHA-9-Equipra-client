"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// 03 §5: Pagination with 42px square buttons (‹, page numbers, ›)
export default function Pagination({ page = 1, pages = 1, onPageChange }) {
  if (pages <= 1) return null;

  function getPageNumbers() {
    const items = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) items.push(i);
    } else {
      items.push(1);
      if (page > 3) items.push("…");

      const start = Math.max(2, page - 1);
      const end = Math.min(pages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!items.includes(i)) items.push(i);
      }

      if (page < pages - 2) items.push("…");
      if (!items.includes(pages)) items.push(pages);
    }

    return items;
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 sm:gap-2 pt-8 sm:pt-10"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex size-10 sm:size-[42px] items-center justify-center rounded-[10px] border border-border bg-surface text-muted transition-colors hover:bg-raised hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {pageNumbers.map((p, idx) => {
        if (p === "…") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex size-10 sm:size-[42px] items-center justify-center font-mono text-xs text-muted"
            >
              …
            </span>
          );
        }

        const isCurrent = p === page;

        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "flex size-10 sm:size-[42px] items-center justify-center rounded-[10px] border font-mono text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
              isCurrent
                ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border-border bg-surface text-muted hover:bg-raised hover:text-foreground",
            )}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className="flex size-10 sm:size-[42px] items-center justify-center rounded-[10px] border border-border bg-surface text-muted transition-colors hover:bg-raised hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
