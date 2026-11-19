import { cn } from "@/lib/utils";

export function AuthField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-subtle">{hint}</p>
      )}
    </div>
  );
}

export function AuthError({ message }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-[10px] border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-danger"
    >
      {message}
    </p>
  );
}

export function AuthHeading({ title, subtitle, children }) {
  return (
    <div className="space-y-2">
      <h1
        className={cn(
          "bg-gradient-to-b from-foreground to-muted bg-clip-text text-3xl font-bold tracking-[-0.045em] text-transparent sm:text-4xl",
        )}
      >
        {title}
      </h1>
      {subtitle}
      {children}
    </div>
  );
}
