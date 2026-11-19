"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57]">
        Something went sideways
      </p>
      <h1 className="text-3xl font-bold tracking-[-0.02em]">
        That didn&apos;t work.
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        A request failed while loading this page. Try again, and if it keeps
        happening contact support.
      </p>
      <Button variant="action" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
