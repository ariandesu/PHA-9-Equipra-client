"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Calendar, Heart, ShieldCheck, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MovingBorder from "@/components/fx/moving-border";
import Spotlight from "@/components/fx/spotlight";
import BookingModal from "@/components/details/booking-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { formatBDT } from "@/lib/money";
import { useFavoriteIds, useToggleFavorite } from "@/lib/data/hooks";
import { cn } from "@/lib/utils";

const SHORT_CATEGORY = {
  "Construction Equipment": "Construction",
  "Photography Equipment": "Photography",
  "Vehicles & Transportation": "Vehicles",
  "Agriculture Equipment": "Agriculture",
  Electronics: "Electronics",
  "Event Equipment": "Event",
};

export default function EquipmentInfo({ item }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isCustomer = !user || user.role === "customer";
  const isOwnerOrAdmin = user && (user.role === "owner" || user.role === "admin");

  const favoriteIds = useFavoriteIds({ enabled: !!user && user.role === "customer" });
  const isFavorite = !!user && (favoriteIds.data?.data ?? []).includes(item.id);
  const toggleFavorite = useToggleFavorite();

  const unavailable = item.quantity === 0;

  const specs = [
    { label: "RENTAL TYPE", value: item.rentalType ? item.rentalType.charAt(0).toUpperCase() + item.rentalType.slice(1) : "Daily" },
    { label: "AVAILABLE QTY", value: `${item.quantity} ${item.quantity === 1 ? "unit" : "units"}` },
    { label: "CONDITION", value: item.condition || "Excellent" },
    { label: "BRAND", value: item.brand || "Standard" },
    { label: "MODEL", value: item.model || "Standard" },
    { label: "CATEGORY", value: SHORT_CATEGORY[item.category] || item.category },
  ];

  function handleFavorite() {
    toggleFavorite.mutate({ equipmentId: item.id, favorited: isFavorite });
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Category and Availability Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral" className="uppercase font-mono text-[11px] tracking-wider">
          {SHORT_CATEGORY[item.category] || item.category}
        </Badge>
        {unavailable ? (
          <Badge variant="danger">Unavailable</Badge>
        ) : (
          <Badge variant="success">{item.quantity} of {item.quantity} available</Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground leading-[1.1]">
        {item.name}
      </h1>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>{item.location}</span>
      </div>

      {/* Price row */}
      <div className="flex flex-wrap items-baseline gap-2 border-b border-border pb-6">
        <span className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
          {formatBDT(item.price)}
        </span>
        <span className="text-sm text-muted">
          per {item.rentalType || "day"} · operator not included
        </span>
      </div>

      {/* 3x2 Spec Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 rounded-[16px] border border-border bg-surface p-4 sm:p-5">
        {specs.map((spec) => (
          <div key={spec.label} className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-muted">
              {spec.label}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons or Owner/Admin Notice */}
      <div className="pt-2">
        {isOwnerOrAdmin ? (
          <div className="flex items-start gap-3 rounded-[16px] border border-warning/30 bg-warning/10 p-4 text-xs sm:text-sm text-warning">
            <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">Notice for {user?.role} accounts</p>
              <p className="mt-0.5 text-muted leading-relaxed">
                Owners and administrators cannot book equipment. Sign in with a customer account to make a reservation.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <MovingBorder className="rounded-full">
              {user ? (
                <Button
                  variant="primary"
                  size="lg"
                  disabled={unavailable}
                  onClick={() => setBookingOpen(true)}
                  className="rounded-full bg-foreground text-background font-bold px-7"
                >
                  <Calendar className="size-4 mr-1.5" aria-hidden="true" />
                  Book now
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  asChild
                  className="rounded-full bg-foreground text-background font-bold px-7"
                >
                  <Link href={`/login?redirect=/equipment/${item.id}`}>
                    <Calendar className="size-4 mr-1.5" aria-hidden="true" />
                    Book now
                  </Link>
                </Button>
              )}
            </MovingBorder>

            {user ? (
              <Button
                variant="outline"
                size="lg"
                onClick={handleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
                aria-pressed={isFavorite}
                className="rounded-full"
              >
                <Heart
                  className={cn("size-4 mr-1.5", isFavorite && "fill-current text-primary")}
                  aria-hidden="true"
                />
                {isFavorite ? "Saved" : "Save"}
              </Button>
            ) : (
              <Button variant="outline" size="lg" asChild className="rounded-full">
                <Link href={`/login?redirect=/equipment/${item.id}`}>
                  <Heart className="size-4 mr-1.5" aria-hidden="true" />
                  Save
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Owner Card with Spotlight */}
      <div className="relative mt-2 flex items-center justify-between overflow-hidden rounded-[18px] border border-border bg-surface p-4 sm:p-5 shadow-sm">
        <Spotlight className="opacity-40" />
        <div className="relative z-10 flex items-center gap-3">
          <Avatar className="size-11 border border-border">
            {item.owner?.image && <AvatarImage src={item.owner.image} alt="" />}
            <AvatarFallback className="bg-primary text-primary-foreground font-mono text-sm font-bold">
              {item.owner?.name?.slice(0, 2).toUpperCase() || "OW"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-foreground">{item.owner?.name || "Equipment Owner"}</p>
            <p className="text-xs text-muted">{item.owner?.email || "owner@equipra.app"} · Owner since 2025</p>
          </div>
        </div>
        <div className="relative z-10 hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-raised px-3 py-1 font-mono text-xs text-muted">
          <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
          <span>Verified owner</span>
        </div>
      </div>

      <BookingModal
        item={item}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
