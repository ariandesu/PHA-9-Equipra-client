import { cn } from "@/lib/utils";

// 03-DESIGN-SYSTEM.md §3: bg-raised, border-border-strong, radius 10px,
// focus border-primary ring-4 ring-primary/15.
function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[10px] border border-border-strong bg-raised px-3 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-subtle focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/15",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
