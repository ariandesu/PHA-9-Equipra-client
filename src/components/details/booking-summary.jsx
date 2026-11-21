"use client";

import { Check } from "lucide-react";
import MovingBorder from "@/components/fx/moving-border";
import { formatBDT } from "@/lib/money";

export default function BookingSummary({ item, quote, quantity, onSubmit, availability, submitDisabled = false }) {
  const availabilityState = availability?.state || "idle";
  const available = availability?.available ?? 0;
  const total = availability?.total ?? item.quantity;
  return (
    <div className="relative md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border bg-surface/50 p-6 sm:p-8 overflow-hidden text-left">
      <div aria-hidden="true" className="fx-dots pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">SUMMARY</p>
        <div className="flex justify-between gap-3 text-xs text-muted">
          <span>Rate</span>
          <span className="font-mono text-foreground">{formatBDT(item.price)} / {item.rentalType}</span>
        </div>
        <div className="flex justify-between gap-3 text-xs text-muted">
          <span>Duration</span>
          <span className="font-medium text-foreground">{quote.days} days ({quote.units} {item.rentalType})</span>
        </div>
        <div className="flex justify-between gap-3 text-xs text-muted">
          <span>Quantity</span>
          <span className="font-medium text-foreground">× {quantity}</span>
        </div>
        <div className="flex justify-between gap-3 text-xs text-muted">
          <span>Delivery</span>
          <span className="text-foreground">Included</span>
        </div>

        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-4 mt-2">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="font-mono text-2xl font-bold text-accent">{formatBDT(quote.totalAmount)}</span>
        </div>

        <p aria-live="polite" className="flex items-center gap-1.5 text-xs pt-1">
          {availabilityState === "loading" && (
            <span className="text-muted">Checking availability…</span>
          )}
          {availabilityState === "success" && available > 0 && (
            <>
              <Check className="size-3.5" aria-hidden="true" />
              <span className="text-success">{available} of {total} units free for these dates</span>
            </>
          )}
          {availabilityState === "success" && available === 0 && (
            <span className="text-danger">No units free for these dates. Try other dates.</span>
          )}
          {availabilityState === "error" && (
            <span className="text-muted">Couldn&apos;t check availability. It&apos;s confirmed again at checkout.</span>
          )}
          {availabilityState === "idle" && (
            <span className="text-muted">Pick dates to check availability</span>
          )}
        </p>
      </div>

      <div className="relative z-10 pt-6">
        <MovingBorder className="w-full rounded-full">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitDisabled}
            className="flex h-11 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to secure payment
          </button>
        </MovingBorder>
        <p className="mt-2 text-center font-mono text-[10px] text-muted">Redirects to Stripe Checkout</p>
      </div>
    </div>
  );
}
