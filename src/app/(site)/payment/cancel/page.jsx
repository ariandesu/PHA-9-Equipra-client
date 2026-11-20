"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking");

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-border bg-surface p-7 sm:p-9 shadow-2xl text-left">
        {/* Warning Icon */}
        <div className="flex size-14 items-center justify-center rounded-full border border-warning/35 bg-warning/15 text-warning mb-5">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </div>

        {/* Headings */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Payment cancelled
        </h1>
        <p className="mt-1.5 text-sm text-muted leading-relaxed">
          Your payment session was cancelled. Unpaid bookings are held for 30 minutes before release.
        </p>

        {/* Action Panel */}
        <div className="mt-6 flex flex-col gap-3 rounded-[16px] border border-border bg-raised/40 p-4 text-xs">
          <p className="text-muted leading-relaxed">
            Payment gateway is in demo mode. Unpaid reservations can be resumed directly from your rentals dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" disabled className="flex-1 opacity-60">
            Pay now (disabled in demo)
          </Button>
          <Button variant="primary" asChild className="flex-1">
            <Link href={bookingId ? `/equipment/${bookingId}` : "/equipment"}>
              Back to equipment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
