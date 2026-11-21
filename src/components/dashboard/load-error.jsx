"use client";

import { Button } from "@/components/ui/button";

export default function LoadError({ title = "Couldn&apos;t load this list", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] border border-border bg-surface p-16 text-center">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted max-w-sm">
        The request failed. Check your connection and try again.
      </p>
      <Button variant="action" size="sm" onClick={onRetry} className="mt-4">
        Try again
      </Button>
    </div>
  );
}