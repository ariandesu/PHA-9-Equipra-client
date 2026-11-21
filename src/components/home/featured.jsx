"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import AnimatedTabs from "@/components/fx/animated-tabs";
import EquipmentCard from "@/components/equipment-card";
import { Button } from "@/components/ui/button";
import { useFeatured } from "@/lib/data/hooks";

const FEATURED_TABS = [
  { id: "all", label: "All", category: null },
  { id: "construction", label: "Construction", category: "Construction Equipment" },
  { id: "photography", label: "Photography", category: "Photography Equipment" },
  { id: "vehicles", label: "Vehicles", category: "Vehicles & Transportation" },
  { id: "electronics", label: "Electronics", category: "Electronics" },
  { id: "events", label: "Events", category: "Event Equipment" },
];

export default function Featured() {
  const [activeTab, setActiveTab] = useState("all");
  const reduced = useReducedMotion();
  const { data: featuredData, isPending, isError, refetch } = useFeatured();

  const allItems = featuredData?.data ?? [];
  const selectedTab = FEATURED_TABS.find((t) => t.id === activeTab);
  const items =
    activeTab === "all"
      ? allItems
      : allItems.filter((item) => item.category === selectedTab?.category);

  return (
    <section className="relative w-full py-16 sm:py-24">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-8 sm:gap-10 px-4">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-2 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
              <span aria-hidden="true">●</span> FEATURED EQUIPMENT
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
              Hand-picked. Admin-approved. Ready to roll.
            </h2>
            <p className="text-sm sm:text-base text-muted">
              Six approved listings, fresh from the database. Log in to see full specs, owner details and live availability.
            </p>
          </div>

          <Button variant="outline" size="sm" asChild className="self-start sm:self-auto shrink-0">
            <Link href="/equipment" className="flex items-center gap-1.5">
              <span>Browse all equipment</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Animated Tabs */}
        <div className="w-full overflow-x-auto pb-1">
          <AnimatedTabs
            tabs={FEATURED_TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Content Panel */}
        <div
          role="tabpanel"
          id="featured-panel"
          aria-labelledby={`tab-${activeTab}`}
          className="w-full"
        >
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-[22px] border border-border bg-surface overflow-hidden h-full"
                >
                  <div className="aspect-[4/3] w-full animate-pulse bg-raised" />
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-20 animate-pulse rounded bg-raised" />
                      <div className="h-4 w-16 animate-pulse rounded bg-raised" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-5 w-4/5 animate-pulse rounded bg-raised" />
                      <div className="h-5 w-3/5 animate-pulse rounded bg-raised" />
                    </div>
                    <div className="h-4 w-28 animate-pulse rounded bg-raised" />
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-14 animate-pulse rounded-full bg-raised" />
                        <div className="h-5 w-24 animate-pulse rounded bg-raised" />
                      </div>
                      <div className="h-9 w-20 animate-pulse rounded-full bg-raised" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-border bg-surface p-16 text-center">
              <h3 className="text-lg font-bold text-foreground">Couldn&apos;t load featured equipment</h3>
              <p className="mt-1 text-sm text-muted max-w-sm">
                The request failed. Check your connection and try again.
              </p>
              <Button variant="action" size="sm" onClick={() => refetch()} className="mt-4">
                Try again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-border bg-surface p-12 text-center">
              <p className="text-base font-medium text-foreground">
                No featured equipment in this category
              </p>
              <p className="mt-1 text-sm text-muted">
                Browse our complete catalog to find all available machinery.
              </p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/equipment">Browse all equipment</Link>
              </Button>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {items.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
