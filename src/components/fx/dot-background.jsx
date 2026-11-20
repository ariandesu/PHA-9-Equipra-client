import { cn } from "@/lib/utils";
import "./fx.css";

// 03-DESIGN-SYSTEM.md §4: 22px #262626 dots behind a radial mask.
// Decorative only, so it never animates.
export default function DotBackground({ className = "", ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn("fx-dots pointer-events-none absolute inset-0", className)}
      {...props}
    />
  );
}
