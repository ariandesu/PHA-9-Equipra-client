"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { useStats } from "@/lib/data/hooks";

export default function Stats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const { data: statsData } = useStats();

  const stats = statsData?.data ?? {
    listings: 1240,
    cities: 38,
    completedRentals: 9600,
    avgRating: 4.8,
  };

  const shouldAnimate = isInView || reduced;

  return (
    <section
      ref={containerRef}
      className="relative w-full border-y border-border bg-surface/50 py-12 sm:py-16"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-8 px-4 text-center lg:grid-cols-4">
        {/* Stat 1: Listings */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            <NumberFlow
              value={shouldAnimate ? stats.listings : 0}
              format={{ useGrouping: true }}
            />
            <span className="text-primary">+</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Approved listings</p>
        </div>

        {/* Stat 2: Cities */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            <NumberFlow value={shouldAnimate ? stats.cities : 0} />
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Cities covered</p>
        </div>

        {/* Stat 3: Completed Rentals */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            <NumberFlow
              value={shouldAnimate ? stats.completedRentals : 0}
              format={{ useGrouping: true }}
            />
            <span className="text-primary">+</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Completed rentals</p>
        </div>

        {/* Stat 4: Average Rating */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            <NumberFlow
              value={shouldAnimate ? stats.avgRating : 0}
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
            />
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Average rating</p>
        </div>
      </div>
    </section>
  );
}
