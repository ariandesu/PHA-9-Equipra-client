"use client";

import { X } from "lucide-react";

export default function ActiveFilters({
  itemsCount,
  total,
  category,
  rentalType,
  minPrice,
  maxPrice,
  availability,
  sort,
  page,
  onRemove,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-6 text-xs text-muted">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-foreground">
          Showing {itemsCount > 0 ? `1–${itemsCount}` : 0} of {total}
        </span>

        {category && (
          <span className="flex items-center gap-1 rounded-full border border-border bg-raised px-2.5 py-0.5 text-foreground">
            {category}
            <button
              type="button"
              aria-label={`Remove category filter ${category}`}
              onClick={() => onRemove("category")}
            >
              <X className="size-3" />
            </button>
          </span>
        )}

        {rentalType && (
          <span className="flex items-center gap-1 rounded-full border border-border bg-raised px-2.5 py-0.5 text-foreground uppercase">
            {rentalType}
            <button
              type="button"
              aria-label={`Remove rental type filter ${rentalType}`}
              onClick={() => onRemove("rentalType")}
            >
              <X className="size-3" />
            </button>
          </span>
        )}

        {(minPrice || maxPrice) && (
          <span className="flex items-center gap-1 rounded-full border border-border bg-raised px-2.5 py-0.5 text-foreground">
            ৳{minPrice || "0"}–{maxPrice || "max"}
            <button
              type="button"
              aria-label="Remove price filter"
              onClick={() => {
                onRemove("minPrice");
                onRemove("maxPrice");
              }}
            >
              <X className="size-3" />
            </button>
          </span>
        )}

        {availability && (
          <span className="flex items-center gap-1 rounded-full border border-border bg-raised px-2.5 py-0.5 text-foreground">
            Available only
            <button
              type="button"
              aria-label="Remove availability filter"
              onClick={() => onRemove("availability")}
            >
              <X className="size-3" />
            </button>
          </span>
        )}
      </div>

      <span className="hidden sm:inline font-mono text-[10px] text-muted">
        GET /api/equipment?sort={sort}&page={page}
      </span>
    </div>
  );
}
