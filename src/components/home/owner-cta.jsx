"use client";

import Link from "next/link";
import LampContainer from "@/components/fx/lamp";
import BackgroundBeams from "@/components/fx/background-beams";
import MovingBorder from "@/components/fx/moving-border";
import { Button } from "@/components/ui/button";

export default function OwnerCTA() {
  return (
    <section className="relative w-full overflow-hidden">
      <LampContainer>
        <BackgroundBeams className="z-0" />
        <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5 mb-3">
            <span aria-hidden="true">●</span> FOR EQUIPMENT OWNERS
          </p>

          <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.045em] text-foreground leading-[1.08]">
            Idle machines don’t pay the bills.{" "}
            <span className="relative inline-block bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              Listings do.
              <svg
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-1.5 left-0 w-full text-accent"
                aria-hidden="true"
              >
                <path
                  d="M2 9.5C50 3 150 3 198 9.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-sm sm:text-base text-muted leading-relaxed">
            List in minutes, get approved, and track every booking and monthly earning from your owner dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MovingBorder>
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 sm:px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              >
                List your equipment
              </Link>
            </MovingBorder>

            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">See owner dashboard</Link>
            </Button>
          </div>
        </div>
      </LampContainer>
    </section>
  );
}
