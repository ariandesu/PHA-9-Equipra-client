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
  "excavators",
  "cinema cameras",
  "cargo vans",
  "tractors",
  "generators",
  "PA systems",
];

const SEARCH_PLACEHOLDERS = [
  "Excavator near Gazipur…",
  "Cinema camera in Gulshan…",
  "Cargo van in Chattogram…",
  "Generator in Comilla…",
];

// Exact 02 §4 category strings mapped from the 01 SVG chips.
const CATEGORY_CHIPS = [
  { label: "Excavators", category: "Construction Equipment" },
  { label: "Cinema cameras", category: "Photography Equipment" },
  { label: "Cargo vans", category: "Vehicles & Transportation" },
  { label: "Tractors", category: "Agriculture Equipment" },
  { label: "Generators", category: "Electronics" },
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
          className="group inline-flex items-center"
        >
          <MovingBorder>
            <div className="flex h-[34px] items-center gap-2.5 rounded-full border border-border bg-[#111111] px-2.5 pr-4 text-xs font-medium text-[#D4D4D4] transition-colors group-hover:bg-raised">
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                NEW
              </span>
              <span>Monthly tractor rentals for harvest season</span>
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </MovingBorder>
        </Link>

        {/* H1 heading */}
        <h1 className="bg-gradient-to-b from-foreground to-muted bg-clip-text text-5xl font-bold tracking-[-0.055em] text-transparent sm:text-7xl lg:text-[84px] lg:leading-[1.02]">
          The rental yard for
          <br />
          <FlipWords words={FLIP_WORDS} />
        </h1>

        {/* Sub-copy with TextGenerate + Highlight */}
        <p className="max-w-2xl text-base sm:text-[19px] leading-relaxed text-muted">
          <TextGenerate words="Excavators, cinema cameras, cargo vans and stage sound from verified owners — booked by the day, week or month." />{" "}
          <Highlight>Paid securely with Stripe.</Highlight>
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
              className="rounded-full border border-border bg-[#111111] px-4 py-1.5 text-xs text-[#D4D4D4] transition-colors hover:border-border-strong hover:bg-raised hover:text-foreground"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
