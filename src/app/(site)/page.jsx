"use client";

import EquipmentCard from "@/components/equipment-card";
import { useFeatured } from "@/lib/data/hooks";

// Placeholder home page. F-03 replaces this section with the real hero and
// featured layout; this only exists so the equipment card can be audited.
export default function Home() {
  const featured = useFeatured();
  const items = (featured.data?.data ?? []).slice(0, 3);

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-4 py-32">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
          <span aria-hidden="true">●</span> Rent the yard
        </p>
        <h1 className="bg-gradient-to-b from-foreground to-muted bg-clip-text text-5xl font-bold tracking-[-0.055em] text-transparent sm:text-6xl">
          Equipra
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted">
          Design tokens, fonts, providers and the layout shell are wired. Home
          page sections land in milestone 5.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EquipmentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
