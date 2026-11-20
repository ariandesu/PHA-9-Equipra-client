"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import ContainerScroll from "@/components/fx/container-scroll";
import { formatBDT } from "@/lib/money";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1778066994998-97f74a5bf901?w=1200&q=75&auto=format&fit=crop";

export default function Showcase() {
  return (
    <section className="relative w-full px-4 pt-4 pb-16">
      <ContainerScroll>
        {/* Browser Mockup Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-[#FF5F56]" />
            <span className="size-3 rounded-full bg-[#FFBD2E]" />
            <span className="size-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="max-w-[170px] sm:max-w-none truncate whitespace-nowrap rounded-full border border-white/10 bg-black/40 px-3 sm:px-4 py-1 font-mono text-[11px] text-[#A3A3A3]">
            equipra.app/equipment/cat-320
          </div>
          <div className="w-12" aria-hidden="true" />
        </div>

        {/* Browser Content */}
        <div className="relative w-full rounded-[20px] bg-surface sm:aspect-[16/10] sm:overflow-hidden">
          {/* Photo area with title overlay */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] sm:rounded-none sm:absolute sm:inset-0 sm:aspect-auto">
            <Image
              fill
              src={HERO_PHOTO}
              alt="CAT 320 Hydraulic Excavator on construction site"
              sizes="(max-width: 1200px) 100vw, 1100px"
              priority
              className="object-cover"
            />

            {/* Dark gradient vignette over the photo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"
            />

            {/* Bottom-left equipment title overlay */}
            <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 flex flex-col items-start gap-1 sm:gap-2 text-left text-white max-w-[calc(100%-1.5rem)] sm:max-w-md">
              <span className="rounded-full border border-white/15 bg-black/60 px-2 sm:px-2.5 py-0.5 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-primary backdrop-blur">
                CONSTRUCTION · GAZIPUR
              </span>
              <h2 className="text-base sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                Hydraulic Excavator 20T — CAT 320
              </h2>
            </div>
          </div>

          {/* Booking panel: in normal flow on mobile (<sm), floating top-right on sm+ */}
          <div className="relative mt-3 w-full rounded-2xl border border-white/15 bg-black/80 p-3.5 sm:mt-0 sm:absolute sm:top-6 sm:right-6 sm:w-[290px] sm:p-4.5 text-left text-white backdrop-blur-md shadow-2xl">
            {/* Price line */}
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-white">
                  {formatBDT(18500)}
                </span>
                <span className="text-xs text-[#A3A3A3]"> per day</span>
              </div>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 gap-2 py-3 border-b border-white/10 text-xs">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                  START
                </span>
                <span className="font-medium text-white">21 Nov</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#8A8A8A]">
                  END
                </span>
                <span className="font-medium text-white">23 Nov</span>
              </div>
            </div>

            {/* Total calculation */}
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-[#A3A3A3]">3 days × 1 unit</span>
              <span className="font-mono font-semibold text-white">
                {formatBDT(55500)}
              </span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-1.5 pb-3 text-[11px] text-success">
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
              <span>2 units free for these dates</span>
            </div>

            {/* Book Now Button */}
            <Link
              href="/equipment/eq-001"
              className="flex w-full items-center justify-center rounded-full bg-primary py-2.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Book now
            </Link>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
