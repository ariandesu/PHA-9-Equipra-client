"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCategories } from "@/lib/data/hooks";
import { cn } from "@/lib/utils";

const CATEGORIES_DATA = [
  {
    num: "01",
    label: "Construction",
    category: "Construction Equipment",
    sub: "excavators, loaders",
    defaultCount: 312,
    image: "https://images.unsplash.com/photo-1747004066130-c6531b74d353?w=1200&q=75&auto=format&fit=crop",
    alt: "Construction equipment excavator",
  },
  {
    num: "02",
    label: "Photography",
    category: "Photography Equipment",
    sub: "cinema rigs, lenses",
    defaultCount: 248,
    image: "https://images.unsplash.com/photo-1757845701047-69080f6b1139?w=1200&q=75&auto=format&fit=crop",
    alt: "Cinema photography cage rig",
  },
  {
    num: "03",
    label: "Vehicles & Transport",
    category: "Vehicles & Transportation",
    sub: "vans, trucks",
    defaultCount: 196,
    image: "https://images.unsplash.com/photo-1737513915304-a298b4fd5865?w=1200&q=75&auto=format&fit=crop",
    position: "60% 88%",
    alt: "Cargo transport van",
  },
  {
    num: "04",
    label: "Agriculture",
    category: "Agriculture Equipment",
    sub: "tractors, harvesters",
    defaultCount: 154,
    image: "https://images.unsplash.com/photo-1761839257961-4dce65b72d99?w=1200&q=75&auto=format&fit=crop",
    alt: "Agriculture harvest tractor",
  },
  {
    num: "05",
    label: "Electronics & Power",
    category: "Electronics",
    sub: "drones, generators",
    defaultCount: 221,
    image: "https://images.unsplash.com/photo-1579829065292-f19b49bc2b98?w=1200&q=75&auto=format&fit=crop",
    alt: "Electronics aerial drone",
  },
  {
    num: "06",
    label: "Event Equipment",
    category: "Event Equipment",
    sub: "sound, stage, lights",
    defaultCount: 109,
    image: "https://images.unsplash.com/photo-1563680401337-b77b5e0be9f7?w=1200&q=75&auto=format&fit=crop",
    alt: "Event equipment line array speakers",
  },
];

export default function FocusCards() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const reduced = useReducedMotion();
  const { data: categoriesRes } = useCategories();

  const countMap = {};
  if (Array.isArray(categoriesRes?.data)) {
    categoriesRes.data.forEach((item) => {
      countMap[item.category] = item.count;
    });
  }

  return (
    <section className="relative w-full py-16 sm:py-24">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-4">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 max-w-2xl text-left">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
            <span aria-hidden="true">●</span> POPULAR CATEGORIES
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
            Six aisles. Everything from cranes to cameras.
          </h2>
        </div>

        {/* 3x2 Grid of tall (400px) photo cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((cat, idx) => {
            const count = countMap[cat.category] ?? cat.defaultCount;
            const isHovered = hoveredIdx === idx;
            const isBlurred = !reduced && hoveredIdx !== null && !isHovered;

            return (
              <Link
                key={cat.category}
                href={`/equipment?category=${encodeURIComponent(cat.category)}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(idx)}
                onBlur={() => setHoveredIdx(null)}
                className={cn(
                  "group relative h-[360px] sm:h-[400px] w-full overflow-hidden rounded-[22px] border border-border bg-surface transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
                  isBlurred && "blur-[5px] scale-[0.97] opacity-70",
                  !reduced && isHovered && "scale-[1.02] shadow-2xl border-border-strong",
                )}
              >
                {/* Background Photo */}
                <Image
                  fill
                  src={cat.image}
                  alt={cat.alt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={
                    cat.position ? { objectPosition: cat.position } : undefined
                  }
                />

                {/* Dark Vignette Overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 transition-opacity group-hover:opacity-90"
                />

                {/* Top Number Badge and Arrow */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur">
                    {cat.num}
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-4 inset-x-4 flex flex-col items-start gap-1 text-left text-white">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {cat.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D4D4D4]">
                    <span className="font-semibold text-white">{count}</span> listings · {cat.sub}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
