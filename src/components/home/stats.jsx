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

  const stats = statsData?.data;
  const shouldAnimate = isInView || reduced;

  const listingsVal = shouldAnimate && stats ? stats.listings : 0;
  const citiesVal = shouldAnimate && stats ? stats.cities : 0;
  const rentalsVal = shouldAnimate && stats ? stats.completedRentals : 0;
  const ratingVal = shouldAnimate && stats ? stats.avgRating : 0;

  const listingsText = stats
    ? `${new Intl.NumberFormat("en-IN").format(stats.listings)}+`
    : "0";
  const citiesText = stats ? `${stats.cities}` : "0";
  const rentalsText = stats
    ? `${new Intl.NumberFormat("en-IN").format(stats.completedRentals)}+`
    : "0";
  const ratingText = stats ? `${stats.avgRating.toFixed(1)}` : "0.0";

  return (
    <section
      ref={containerRef}
      className="relative w-full border-y border-border bg-surface/50 py-12 sm:py-16"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-8 px-4 text-center lg:grid-cols-4">
        {/* Stat 1: Listings */}
        <div className="flex flex-col items-center">
          <span className="sr-only">{listingsText}</span>
          <div
            aria-hidden="true"
            className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            <NumberFlow
              value={listingsVal}
              format={{ useGrouping: true }}
            />
            <span className="text-primary">+</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Approved listings</p>
        </div>

        {/* Stat 2: Cities */}
        <div className="flex flex-col items-center">
          <span className="sr-only">{citiesText}</span>
          <div
            aria-hidden="true"
            className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            <NumberFlow value={citiesVal} />
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Cities covered</p>
        </div>

        {/* Stat 3: Completed Rentals */}
        <div className="flex flex-col items-center">
          <span className="sr-only">{rentalsText}</span>
          <div
            aria-hidden="true"
            className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            <NumberFlow
              value={rentalsVal}
              format={{ useGrouping: true }}
            />
            <span className="text-primary">+</span>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Completed rentals</p>
        </div>

        {/* Stat 4: Average Rating */}
        <div className="flex flex-col items-center">
          <span className="sr-only">{ratingText}</span>
          <div
            aria-hidden="true"
            className="flex items-baseline font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            <NumberFlow
              value={ratingVal}
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
            />
          </div>
          <p className="mt-2 text-xs sm:text-sm text-muted">Average rating</p>
        </div>
      </div>
    </section>
  );
}
