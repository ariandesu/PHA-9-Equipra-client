"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GlowCard from "@/components/fx/glow-card";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { formatBDT } from "@/lib/money";
import { useFavoriteIds, useToggleFavorite } from "@/lib/data/hooks";

// Short labels as they read on screen 01 and 03.
const CATEGORY_LABEL = {
  "Construction Equipment": "Construction",
  "Photography Equipment": "Photography",
  "Vehicles & Transportation": "Vehicles & Transport",
  "Agriculture Equipment": "Agriculture",
  Electronics: "Electronics",
  "Event Equipment": "Event",
};

const PERIOD_LABEL = { daily: "day", weekly: "week", monthly: "month" };

const HEART_CLASS =
  "absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-raised focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:outline-none";

export default function EquipmentCard({ item }) {
  const reduced = useReducedMotion();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isCustomer = !!user && user.role === "customer";

  const favoriteIds = useFavoriteIds();
  const isFavorite =
    isCustomer && (favoriteIds.data?.data ?? []).includes(item.id);
  const toggleFavorite = useToggleFavorite();

  const detailHref = `/equipment/${item.id}`;
  const unavailable = item.quantity === 0;

  function handleToggleFavorite() {
    toggleFavorite.mutate({ equipmentId: item.id, favorited: isFavorite });
  }

  // Render method, not a nested ternary: signed-in customers get the toggle,
  // logged-out visitors get a link to login, owners and admins get nothing.
  function renderHeart() {
    if (isPending) {
      return <span aria-hidden="true" className={HEART_CLASS} />;
    }
    if (isCustomer) {
      return (
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className={HEART_CLASS}
        >
          <Heart
            aria-hidden="true"
            className={cn("size-4", isFavorite && "fill-current text-primary")}
          />
        </button>
      );
    }
    if (user) {
      return null;
    }
    return (
      <Link
        href={`/login?redirect=${encodeURIComponent(detailHref)}`}
        aria-label="Add to favorites"
        className={HEART_CLASS}
      >
        <Heart aria-hidden="true" className="size-4" />
      </Link>
    );
  }

  return (
    <GlowCard className="h-full overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          fill
          src={item.image}
          alt={item.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            !reduced && "group-hover/glow:scale-[1.07]",
            unavailable && "grayscale",
          )}
          style={
            item.imagePosition ? { objectPosition: item.imagePosition } : undefined
          }
        />

        {renderHeart()}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57]">
            {CATEGORY_LABEL[item.category] ?? item.category}
          </span>
          {unavailable ? (
            <Badge variant="danger">Unavailable</Badge>
          ) : (
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {item.quantity} available
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[47.5px] text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-foreground">
          {item.name}
        </h3>

        <p className="text-sm text-muted">{item.location}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div className="flex flex-col items-start gap-2">
            <Badge variant="neutral">{item.rentalType.toUpperCase()}</Badge>
            <p className="font-mono text-lg font-semibold text-foreground">
              {formatBDT(item.price)}
              <span className="text-sm font-normal text-muted">
                {" "}
                / {PERIOD_LABEL[item.rentalType] ?? item.rentalType}
              </span>
            </p>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href={detailHref}>Details</Link>
          </Button>
        </div>
      </div>
    </GlowCard>
  );
}
