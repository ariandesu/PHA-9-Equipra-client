import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackgroundBeams from "@/components/fx/background-beams";
import Spotlight from "@/components/fx/spotlight";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <BackgroundBeams />
      <Spotlight />
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57]">
        Error 404 · app/not-found.jsx
      </p>
      <h1 className="mt-4 bg-gradient-to-b from-foreground to-muted bg-clip-text text-8xl font-bold tracking-[-0.055em] text-transparent">
        404
      </h1>
      <h2 className="mt-2 text-2xl font-semibold">This page is out on rent.</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        The link may be broken or the listing was removed. Let&apos;s get you
        back to the yard.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="primary">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/equipment">Browse equipment</Link>
        </Button>
      </div>
    </main>
  );
}
