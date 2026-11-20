"use client";

import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// 03 §5 Screen 04: gallery (main 4:3 with hover zoom + 4 thumbs)
export default function EquipmentGallery({ item }) {
  const reduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  // Four gallery views for the equipment item
  const images = [
    item.image,
    item.image,
    item.image,
    item.image,
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main 4:3 photo container with hover zoom */}
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-border bg-surface">
        <Image
          fill
          src={images[activeIdx]}
          alt={item.name}
          priority
          sizes="(max-width: 1024px) 100vw, 550px"
          className={cn(
            "object-cover transition-transform duration-500 ease-out cursor-zoom-in",
            !reduced && "group-hover:scale-125",
            item.quantity === 0 && "grayscale",
          )}
          style={
            item.imagePosition ? { objectPosition: item.imagePosition } : undefined
          }
        />

        {/* Counter & Zoom Badge */}
        <div className="pointer-events-none absolute bottom-3.5 left-3.5 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[11px] text-white backdrop-blur">
          {activeIdx + 1} / {images.length} · HOVER TO ZOOM
        </div>
      </div>

      {/* 4 Thumbnails strip */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {images.map((img, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`View photo ${idx + 1} of ${item.name}`}
              aria-pressed={isActive}
              className={cn(
                "relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "border-primary ring-2 ring-primary/25 shadow-sm"
                  : "border-border hover:border-border-strong opacity-70 hover:opacity-100",
              )}
            >
              <Image
                fill
                src={img}
                alt=""
                sizes="120px"
                className="object-cover"
                style={
                  item.imagePosition ? { objectPosition: item.imagePosition } : undefined
                }
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
