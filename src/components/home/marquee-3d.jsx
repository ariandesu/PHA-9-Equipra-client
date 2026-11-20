"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import "@/components/fx/fx.css";

const PHOTO_URLS = [
  { key: "hero", url: "https://images.unsplash.com/photo-1778066994998-97f74a5bf901?w=1200&q=75&auto=format&fit=crop", alt: "Site excavator operating on construction terrain" },
  { key: "excavator", url: "https://images.unsplash.com/photo-1747004066130-c6531b74d353?w=1200&q=75&auto=format&fit=crop", alt: "Hydraulic excavator 20T on construction site" },
  { key: "demo", url: "https://images.unsplash.com/photo-1758965285803-1cdd3371563b?w=1200&q=75&auto=format&fit=crop", alt: "Demolition excavator 13T with hydraulic breaker" },
  { key: "cinema", url: "https://images.unsplash.com/photo-1775559052522-2f7a4abbce8e?w=1200&q=75&auto=format&fit=crop", alt: "Cinema camera shoulder rig with monitor" },
  { key: "rig", url: "https://images.unsplash.com/photo-1757845701047-69080f6b1139?w=1200&q=75&auto=format&fit=crop", alt: "Sony FX3 cinema cage kit with lenses" },
  { key: "studio", url: "https://images.unsplash.com/photo-1759417501276-a309088f1521?w=1200&q=75&auto=format&fit=crop", alt: "Studio cinema camera with prime lens" },
  { key: "van", url: "https://images.unsplash.com/photo-1737513915304-a298b4fd5865?w=1200&q=75&auto=format&fit=crop", alt: "Ford cargo van 1.5T parked by trees", position: "60% 88%" },
  { key: "tractor", url: "https://images.unsplash.com/photo-1761839257961-4dce65b72d99?w=1200&q=75&auto=format&fit=crop", alt: "Farm tractor working in agricultural field" },
  { key: "drone", url: "https://images.unsplash.com/photo-1579829065292-f19b49bc2b98?w=1200&q=75&auto=format&fit=crop", alt: "DJI Mavic mini drone ready for flight" },
  { key: "generator", url: "https://images.unsplash.com/photo-1759692071712-adc78a8516c8?w=1200&q=75&auto=format&fit=crop", alt: "Atlas Copco 60kVA mobile generator unit" },
  { key: "speaker", url: "https://images.unsplash.com/photo-1563680401337-b77b5e0be9f7?w=1200&q=75&auto=format&fit=crop", alt: "Line array PA speaker system hanging for live sound" },
  { key: "stage", url: "https://images.unsplash.com/photo-1677497533660-adca109c2f71?w=1200&q=75&auto=format&fit=crop", alt: "Stage truss structure with moving head lighting" },
];

const COLUMNS = [
  [PHOTO_URLS[0], PHOTO_URLS[1], PHOTO_URLS[2]],
  [PHOTO_URLS[3], PHOTO_URLS[4], PHOTO_URLS[5]],
  [PHOTO_URLS[6], PHOTO_URLS[7], PHOTO_URLS[8]],
  [PHOTO_URLS[9], PHOTO_URLS[10], PHOTO_URLS[11]],
];

export default function Marquee3D() {
  const reduced = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-background py-20 sm:py-28 text-center">
      {/* 3D Tilted photo canvas container */}
      <div className="relative mx-auto h-[480px] sm:h-[580px] w-full max-w-full overflow-hidden [perspective:1400px]">
        {/* Background tilted grid */}
        <div
          aria-hidden={reduced ? undefined : "true"}
          className={`fx-marquee-3d absolute -inset-x-20 -top-32 flex justify-center gap-4 sm:gap-6 opacity-40 dark:opacity-30 ${
            reduced
              ? ""
              : "[transform:rotateX(55deg)_rotateZ(-45deg)]"
          }`}
        >
          {COLUMNS.map((col, colIdx) => {
            const isUp = colIdx % 2 === 0;
            const animClass = reduced ? "" : isUp ? "fx-col-up" : "fx-col-down";

            return (
              <div key={colIdx} className="flex flex-col gap-4 sm:gap-6">
                <div className={`flex flex-col gap-4 sm:gap-6 ${animClass}`}>
                  {[...col, ...col].map((item, itemIdx) => {
                    const isDup = itemIdx >= col.length;
                    return (
                      <div
                        key={`${item.key}-${itemIdx}`}
                        aria-hidden={isDup ? "true" : undefined}
                        className="relative h-44 w-32 sm:h-64 sm:w-48 overflow-hidden rounded-[18px] border border-border bg-surface shrink-0 shadow-lg"
                      >
                        <Image
                          fill
                          src={item.url}
                          alt={item.alt}
                          sizes="(max-width: 640px) 128px, 192px"
                          className="object-cover"
                          style={
                            item.position ? { objectPosition: item.position } : undefined
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Radial dark gradient vignette over the marquee */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--background)_30%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,#0A0A0A_30%,transparent_100%)] opacity-95"
        />

        {/* Centered Heading Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-[800px] flex-col items-center justify-center px-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5 mb-3">
            <span aria-hidden="true">●</span> THE WHOLE YARD
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-tight text-foreground leading-[1.05]">
            1,240+ machines.
            <br />
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
              One marketplace.
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-muted">
            Construction, film, transport, farming, power and events — every listing reviewed by an admin before it goes live.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="action" asChild>
              <Link href="/equipment">Explore all equipment</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">List your machine</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
