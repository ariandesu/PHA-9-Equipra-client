"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MovingBorder from "@/components/fx/moving-border";
import Spotlight from "@/components/fx/spotlight";
import GridBackground from "@/components/fx/grid-background";
import FlipWords from "@/components/fx/flip-words";
import TextGenerate from "@/components/fx/text-generate";
import Highlight from "@/components/fx/highlight";
import VanishInput from "@/components/fx/vanish-input";

const FLIP_WORDS = [
  "every deadline",
  "every site",
  "every shoot",
  "every harvest",
  "every event",
  "every budget",
];

const SEARCH_PLACEHOLDERS = [
  "Dozer near Khulna…",
  "Video kit in Mirpur…",
  "Truck in Jashore…",
  "Genset in Keraniganj…",
];

// Exact 02 §4 category strings mapped from the 01 SVG chips.
const CATEGORY_CHIPS = [
  { label: "Bulldozers", category: "Construction Equipment" },
  { label: "Video kits", category: "Photography Equipment" },
  { label: "Trucks", category: "Vehicles & Transportation" },
  { label: "Tillers", category: "Agriculture Equipment" },
  { label: "Gensets", category: "Electronics" },
  { label: "PA systems", category: "Event Equipment" },
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-24 text-center">
      <Spotlight />
      <GridBackground />

      <div className="relative z-10 flex max-w-[1100px] flex-col items-center gap-6 sm:gap-8">
        {/* Badge pill */}
        <Link
          href={`/equipment?category=${encodeURIComponent("Agriculture Equipment")}`}
          className="group inline-flex items-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
        >
          <MovingBorder>
            <div className="flex h-[34px] items-center gap-2.5 rounded-full border border-border bg-surface px-2.5 pr-4 text-xs font-medium text-foreground transition-colors group-hover:bg-raised">
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                NEW
              </span>
              <span>Monthly tiller slots for aman season</span>
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </MovingBorder>
        </Link>

        {/* H1 heading */}
        <h1 className="text-5xl font-bold tracking-[-0.055em] sm:text-7xl lg:text-[84px] lg:leading-[1.02]">
          <span className="sr-only">
            Work-ready machines from verified owners — booked by the day, week or month
          </span>
          <span
            aria-hidden="true"
            className="inline-block bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent"
          >
            The right machine for
            <br />
            <FlipWords words={FLIP_WORDS} />
          </span>
        </h1>

        {/* Sub-copy with TextGenerate + Highlight */}
        <p className="max-w-2xl text-base sm:text-[19px] leading-relaxed text-muted">
          <TextGenerate words="Dozer days, shoot days and harvest days — hired from checked owners by the day, week or month." />{" "}
          <Highlight>Checked out with Stripe.</Highlight>
        </p>

        {/* VanishInput search */}
        <div className="w-full pt-2 flex justify-center">
          <VanishInput placeholders={SEARCH_PLACEHOLDERS} />
        </div>

        {/* 6 category chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-xl">
          {CATEGORY_CHIPS.map((chip) => (
            <Link
              key={chip.category}
              href={`/equipment?category=${encodeURIComponent(chip.category)}`}
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted transition-colors hover:border-border-strong hover:bg-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
