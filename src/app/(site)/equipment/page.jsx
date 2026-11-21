"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Spotlight from "@/components/fx/spotlight";
import GridBackground from "@/components/fx/grid-background";
import EquipmentCard from "@/components/equipment-card";
import FilterSidebar from "@/components/catalog/filter-sidebar";
import ActiveFilters from "@/components/catalog/active-filters";
import Pagination from "@/components/catalog/pagination";
import { Button } from "@/components/ui/button";
import { useEquipmentList, useCategories } from "@/lib/data/hooks";

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramSearch = searchParams.get("search") || "";
  const paramCategory = searchParams.get("category") || "";
  const paramRentalType = searchParams.get("rentalType") || "";
  const paramMinPrice = searchParams.get("minPrice") || "";
  const paramMaxPrice = searchParams.get("maxPrice") || "";
  const paramAvail = searchParams.get("availability") || "";
  const paramSort = searchParams.get("sort") || "newest";
  const paramPage = Number.parseInt(searchParams.get("page") || "1", 10);

  const [filters, setFilters] = useState({
    search: paramSearch,
    category: paramCategory,
    rentalType: paramRentalType,
    minPrice: paramMinPrice,
    maxPrice: paramMaxPrice,
    availability: paramAvail,
    sort: paramSort,
  });

  const queryParams = {
    search: paramSearch || undefined,
    category: paramCategory || undefined,
    rentalType: paramRentalType || undefined,
    minPrice: paramMinPrice ? Number(paramMinPrice) : undefined,
    maxPrice: paramMaxPrice ? Number(paramMaxPrice) : undefined,
    availability: paramAvail || undefined,
    sort: paramSort,
    page: paramPage,
    limit: 9,
  };

  const { data: listRes, isPending, isError, refetch } = useEquipmentList(queryParams);
  const { data: catRes } = useCategories();

  const countMap = {};
  if (Array.isArray(catRes?.data)) {
    catRes.data.forEach((c) => { countMap[c.category] = c.count; });
  }

  const items = listRes?.items ?? [];
  const total = listRes?.total ?? 0;
  const page = listRes?.page ?? 1;
  const pages = listRes?.pages ?? 1;

  function updateUrl(newParams) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === undefined || v === "" || v === null) params.delete(k);
      else params.set(k, String(v));
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Centered Header */}
      <section className="relative isolate flex flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-12 text-center">
        <Spotlight />
        <GridBackground />

        <div className="relative z-10 flex max-w-2xl flex-col items-center gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
            <span aria-hidden="true">●</span>
            {isPending ? (
              "CATALOG · LOADING LISTINGS"
            ) : isError ? (
              "CATALOG · LISTINGS UNAVAILABLE"
            ) : (
              `CATALOG · ${total} APPROVED LISTINGS`
            )}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
            All equipment
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-muted">
            Search, filter and sort happen on the server, so results stay fast even with thousands of machines.
          </p>

          {/* Search + Sort Bar */}
          <div className="mt-6 flex w-full max-w-xl flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="size-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search name or location…"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && updateUrl({ ...filters, page: 1 })}
                className="w-full rounded-full border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs text-muted font-mono">Sort</span>
              <select
                value={paramSort}
                onChange={(e) => updateUrl({ sort: e.target.value, page: 1 })}
                className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              >
                <option value="newest">Recently added</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid + Filter Sidebar */}
      <div className="mx-auto flex w-full max-w-[1100px] flex-col lg:flex-row items-start gap-8 px-4 pt-6">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onApply={() => updateUrl({ ...filters, page: 1 })}
          onReset={() => router.push(pathname)}
          counts={countMap}
          className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24"
        />

        <div className="flex flex-1 flex-col w-full min-w-0">
          <ActiveFilters
            itemsCount={isPending || isError ? 0 : items.length}
            total={isPending || isError ? 0 : total}
            category={paramCategory}
            rentalType={paramRentalType}
            minPrice={paramMinPrice}
            maxPrice={paramMaxPrice}
            availability={paramAvail}
            sort={paramSort}
            page={page}
            onRemove={(k) => updateUrl({ [k]: "", page: 1 })}
            loading={isPending}
            error={isError}
          />

          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col rounded-[22px] border border-border bg-surface overflow-hidden h-[400px] animate-pulse">
                  <div className="aspect-[4/3] w-full bg-raised" />
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="h-4 w-20 rounded bg-raised" />
                    <div className="h-6 w-3/4 rounded bg-raised" />
                    <div className="mt-auto h-8 w-24 rounded bg-raised" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-border bg-surface p-16 text-center">
              <h3 className="text-lg font-bold text-foreground">Couldn&apos;t load equipment</h3>
              <p className="mt-1 text-sm text-muted max-w-sm">
                The request failed. Check your connection and try again.
              </p>
              <Button variant="action" size="sm" onClick={() => refetch()} className="mt-4">
                Try again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-border bg-surface p-16 text-center">
              <h3 className="text-lg font-bold text-foreground">No equipment found</h3>
              <p className="mt-1 text-sm text-muted max-w-sm">
                Try adjusting your search or filters to find what you need.
              </p>
              <Button variant="outline" size="sm" onClick={() => router.push(pathname)} className="mt-4">
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {!isPending && !isError && (
            <Pagination page={page} pages={pages} onPageChange={(p) => updateUrl({ page: p })} />
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogPageContent() {
  const searchParams = useSearchParams();
  return <CatalogContent key={searchParams.toString()} />;
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CatalogPageContent />
    </Suspense>
  );
}
