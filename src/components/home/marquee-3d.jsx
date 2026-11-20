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
  [PHOTO_URLS[0], PHOTO_URLS[4], PHOTO_URLS[8]],
];

export default function Marquee3D() {
  const reduced = useReducedMotion();

  return (
    <section className="relative w-full py-16 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-4">
        {/* Bordered rounded-[22px] panel matching design 01 */}
        <div
          data-slot="marquee-panel"
          className="group/marquee relative h-[460px] sm:h-[640px] w-full overflow-hidden rounded-[22px] border border-border bg-[#0B0B0B] text-center [perspective:1400px]"
        >
          {/* Tilted photo wall filling the panel with center aligned */}
          <div
            aria-hidden={reduced ? undefined : "true"}
            className="pointer-events-none absolute left-1/2 top-1/2 flex gap-4 sm:gap-6 opacity-90 sm:opacity-95 [transform:translate(-50%,-50%)_rotateX(55deg)_rotateZ(-45deg)]"
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
                          key={`${item.key}-${colIdx}-${itemIdx}`}
                          aria-hidden={isDup ? "true" : undefined}
                          className="relative h-44 w-32 sm:h-72 sm:w-52 overflow-hidden rounded-[16px] sm:rounded-[18px] border border-white/10 bg-surface shrink-0 shadow-2xl"
                        >
                          <Image
                            fill
                            src={item.url}
                            alt={item.alt}
                            loading="eager"
                            sizes="(max-width: 640px) 128px, 208px"
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

          {/* Soft radial scrim over the center so text is legible and photos stay visible */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 fx-marquee-scrim"
          />

          {/* Centered Heading Content */}
          <div className="relative z-10 mx-auto flex h-full max-w-[800px] flex-col items-center justify-center px-4 sm:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5 mb-2 sm:mb-3">
              <span aria-hidden="true">●</span> THE WHOLE YARD
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground leading-[1.05]">
              1,240+ machines.
              <br />
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                One marketplace.
              </span>
            </h2>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-muted">
              Construction, film, transport, farming, power and events — every listing reviewed by an admin before it goes live.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button variant="action" asChild>
                <Link href="/equipment">Explore all equipment</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">List your machine</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
