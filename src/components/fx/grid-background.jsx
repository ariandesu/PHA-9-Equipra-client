import { cn } from "@/lib/utils";
import "./fx.css";

// 03-DESIGN-SYSTEM.md §4: 56px #1A1A1A grid lines behind a radial mask.
// Decorative only, so it never animates.
export default function GridBackground({ className = "", ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn("fx-grid pointer-events-none absolute inset-0", className)}
      {...props}
    />
  );
}
