"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Construction", value: "Construction Equipment" },
  { label: "Photography", value: "Photography Equipment" },
  { label: "Vehicles & Transport", value: "Vehicles & Transportation" },
  { label: "Agriculture", value: "Agriculture Equipment" },
  { label: "Electronics", value: "Electronics" },
  { label: "Event", value: "Event Equipment" },
];

const RENTAL_TYPES = [
  { label: "All", value: "" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export default function FilterSidebar({
  filters,
  onChange,
  onApply,
  onReset,
  counts = {},
  className = "",
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-6 rounded-[22px] border border-border bg-surface p-6 shadow-sm",
        className,
      )}
    >
      {/* Header: Filters + Reset */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-base font-bold text-foreground">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-xs text-primary dark:text-accent transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:underline"
        >
          Reset
        </button>
      </div>

      {/* Category Checkboxes */}
      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Category
        </h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((cat) => {
            const count = counts[cat.value] ?? counts[cat.label];
            const isChecked = filters.category === cat.value;

            return (
              <label
                key={cat.value}
                className="flex cursor-pointer items-center justify-between text-xs sm:text-sm text-foreground transition-opacity hover:opacity-90"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      onChange({
                        ...filters,
                        category: checked ? cat.value : "",
                      })
                    }
                  />
                  <span>{cat.label}</span>
                </div>
                {count !== undefined && (
                  <span className="font-mono text-xs text-muted">{count}</span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Rental Type Chips */}
      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Rental Type
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {RENTAL_TYPES.map((rt) => {
            const active = (filters.rentalType || "") === rt.value;
            return (
              <button
                key={rt.label}
                type="button"
                onClick={() => onChange({ ...filters, rentalType: rt.value })}
                className={cn(
                  "rounded-full px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-foreground text-background font-semibold"
                    : "border border-border bg-raised text-muted hover:text-foreground",
                )}
              >
                {rt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Price Range (৳)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step={500}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({ ...filters, minPrice: e.target.value })
            }
            className="w-full rounded-[10px] border border-border bg-raised px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min={0}
            step={500}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: e.target.value })
            }
            className="w-full rounded-[10px] border border-border bg-raised px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <label
          htmlFor="avail-switch"
          className="cursor-pointer text-xs sm:text-sm font-medium text-foreground"
        >
          Available now only
        </label>
        <Switch
          id="avail-switch"
          checked={filters.availability === "available"}
          onCheckedChange={(checked) =>
            onChange({
              ...filters,
              availability: checked ? "available" : "",
            })
          }
        />
      </div>

      {/* Apply Button */}
      <Button variant="primary" onClick={onApply} className="w-full mt-2">
        Apply filters
      </Button>
    </aside>
  );
}
