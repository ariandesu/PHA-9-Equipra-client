"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ExternalLink } from "lucide-react";
import { formatBDT } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { useFavorites, useToggleFavorite } from "@/lib/data/hooks";

export default function FavoritesTable() {
  const { data: favsRes, isPending } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const items = favsRes?.items ?? (Array.isArray(favsRes) ? favsRes : []);

  function handleRemove(equipmentId) {
    toggleFavorite.mutate({ equipmentId, favorited: true });
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / FAVORITES</p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Favorites</h1>
          <span className="rounded-full border border-border bg-raised px-2.5 py-0.5 font-mono text-xs text-muted">
            {items.length} SAVED
          </span>
        </div>
      </div>

      {/* Favorites Table Card */}
      <div className="rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    Loading saved favorites...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    <p className="text-sm font-medium text-foreground">No saved favorites yet</p>
                    <p className="mt-1 text-xs">Tap the heart on any equipment listing to save it here.</p>
                    <Button variant="outline" size="sm" asChild className="mt-4">
                      <Link href="/equipment">Browse equipment</Link>
                    </Button>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-[8px] border border-border bg-raised">
                          {item.image && (
                            <Image
                              fill
                              src={item.image}
                              alt={item.name}
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <Link href={`/equipment/${item.id}`} className="hover:underline font-semibold line-clamp-1">
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {formatBDT(item.price)}
                      <span className="text-xs font-normal text-muted">/{item.rentalType === "weekly" ? "wk" : item.rentalType === "monthly" ? "mo" : "day"}</span>
                    </td>
                    <td className="py-3.5 px-3 text-muted whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild className="h-8 px-3 text-xs">
                          <Link href={`/equipment/${item.id}`}>
                            <span>View details</span>
                            <ExternalLink className="size-3 ml-1" />
                          </Link>
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Remove ${item.name} from favorites`}
                          className="flex size-8 items-center justify-center rounded-[8px] border border-border text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
