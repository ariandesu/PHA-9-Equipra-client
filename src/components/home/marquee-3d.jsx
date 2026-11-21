"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useStats } from "@/lib/data/hooks";
import "@/components/fx/fx.css";

const PHOTO_URLS = [
  { key: "hero", url: "https://images.unsplash.com/photo-1778066994998-97f74a5bf901?w=1200&q=75&auto=format&fit=crop", alt: "Dozer grading a work site" },
  { key: "dozer", url: "https://images.unsplash.com/photo-1747004066130-c6531b74d353?w=1200&q=75&auto=format&fit=crop", alt: "Bulldozer parked at golden hour" },
  { key: "digger", url: "https://images.unsplash.com/photo-1758965285803-1cdd3371563b?w=1200&q=75&auto=format&fit=crop", alt: "Mini excavator digging a trench" },
  { key: "video", url: "https://images.unsplash.com/photo-1775559052522-2f7a4abbce8e?w=1200&q=75&auto=format&fit=crop", alt: "Video kit with gimbal on a shoot" },
  { key: "lights", url: "https://images.unsplash.com/photo-1757845701047-69080f6b1139?w=1200&q=75&auto=format&fit=crop", alt: "LED panels lighting a small set" },
  { key: "film", url: "https://images.unsplash.com/photo-1759417501276-a309088f1521?w=1200&q=75&auto=format&fit=crop", alt: "Vintage film camera on a table" },
  { key: "truck", url: "https://images.unsplash.com/photo-1737513915304-a298b4fd5865?w=1200&q=75&auto=format&fit=crop", alt: "Covered mini truck on the road", position: "60% 88%" },
  { key: "tiller", url: "https://images.unsplash.com/photo-1761839257961-4dce65b72d99?w=1200&q=75&auto=format&fit=crop", alt: "Power tiller crossing a green field" },
  { key: "action", url: "https://images.unsplash.com/photo-1579829065292-f19b49bc2b98?w=1200&q=75&auto=format&fit=crop", alt: "Action camera mounted for a ride" },
  { key: "genset", url: "https://images.unsplash.com/photo-1759692071712-adc78a8516c8?w=1200&q=75&auto=format&fit=crop", alt: "Diesel genset outside a site office" },
  { key: "pa", url: "https://images.unsplash.com/photo-1563680401337-b77b5e0be9f7?w=1200&q=75&auto=format&fit=crop", alt: "Column speakers at a courtyard event" },
  { key: "pars", url: "https://images.unsplash.com/photo-1677497533660-adca109c2f71?w=1200&q=75&auto=format&fit=crop", alt: "Par can lights washing a stage" },
];

// 9 columns, 6 unique photos each, no photo repeats consecutively in a column.
// Rotation scheme: (c * 5 + i * 2) % 12 ensures neighbouring columns are offset.
const COLUMNS = Array.from({ length: 9 }, (_, c) =>
  Array.from({ length: 6 }, (_, i) => PHOTO_URLS[(c * 5 + i * 2) % PHOTO_URLS.length])
);

export default function Marquee3D() {
  const reduced = useReducedMotion();
  const { data: statsData } = useStats();
  const listings = statsData?.data?.listings;

  return (
    <section className="relative w-full py-16 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-4">
        {/* Bordered rounded-[22px] panel matching design 01 */}
        <div
          data-slot="marquee-panel"
          className="dark group/marquee relative h-[460px] sm:h-[640px] w-full overflow-hidden rounded-[22px] border border-border bg-[radial-gradient(ellipse_at_center,#161616,#0B0B0B)] text-center [perspective:1400px]"
        >
          {/* Tilted photo wall filling the panel with center aligned */}
          <div
            aria-hidden={reduced ? undefined : "true"}
            className="pointer-events-none absolute left-1/2 top-1/2 flex gap-4 sm:gap-6 opacity-90 sm:opacity-95 [transform:translate(-50%,-50%)_rotateX(55deg)_rotateZ(-45deg)]"
          >
            {COLUMNS.map((col, colIdx) => {
              const isUp = colIdx % 2 === 0;
              const animClass = reduced ? "" : isUp ? "fx-col-up" : "fx-col-down";
              const duration = colIdx % 2 === 0 ? 28 : 34;
              const delay = (colIdx * 3.7) % duration;

              return (
                <div key={colIdx} className="flex flex-col">
                  <div
                    className={`flex flex-col ${animClass}`}
                    style={{
                      animationDelay: reduced ? undefined : `-${delay}s`,
                      animationDuration: reduced ? undefined : `${duration}s`,
                      willChange: reduced ? undefined : "transform",
                    }}
                  >
                    {[0, 1, 2].map((copy) => (
                      <div
                        key={copy}
                        aria-hidden={copy === 0 ? undefined : "true"}
                        className="flex flex-col gap-4 sm:gap-6 pb-4 sm:pb-6"
                      >
                        {col.map((item, itemIdx) => (
                          <div
                            key={`${item.key}-${colIdx}-${itemIdx}-c${copy}`}
                            aria-hidden={copy === 0 ? undefined : "true"}
                            className="relative h-44 w-32 sm:h-72 sm:w-52 overflow-hidden rounded-[16px] sm:rounded-[18px] border border-white/10 bg-surface shrink-0 shadow-2xl"
                          >
                            <Image
                              fill
                              src={item.url}
                              alt={item.alt}
                              loading={copy === 0 ? "eager" : "lazy"}
                              sizes="(max-width: 640px) 128px, 208px"
                              className="object-cover"
                              style={
                                item.position ? { objectPosition: item.position } : undefined
                              }
                            />
                          </div>
                        ))}
                      </div>
                    ))}
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
              <span aria-hidden="true">●</span> THE FULL FLEET
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-foreground leading-[1.05]">
              {typeof listings === "number" ? `${listings.toLocaleString("en-IN")} machines.` : "Every machine."}
              <br />
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                One counter.
              </span>
            </h2>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-muted">
              Earthmovers, lenses, trucks, tillers, power and event gear — every listing passes an admin check before it can be hired.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button variant="action" asChild>
                <Link href="/equipment">Browse the yard</Link>
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