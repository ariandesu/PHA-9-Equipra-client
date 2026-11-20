"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import Meteors from "@/components/fx/meteors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const bookingId = searchParams.get("booking") || "bk-008";

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-border bg-surface p-7 sm:p-9 shadow-2xl text-left">
        <Meteors number={12} />

        {/* Demo Mode Badge */}
        {isDemo && (
          <div className="mb-6 flex items-center justify-between">
            <Badge variant="warning" className="px-3 py-1 font-mono text-xs">
              Demo mode — no payment taken
            </Badge>
            <span className="font-mono text-[11px] text-muted">MOCK TRANSACTION</span>
          </div>
        )}

        {/* Success Icon */}
        <div className="flex size-14 items-center justify-center rounded-full border border-success/35 bg-success/15 text-success mb-5">
          <Check className="size-7" aria-hidden="true" />
        </div>

        {/* Headings */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Payment successful
        </h1>
        <p className="mt-1.5 text-sm text-muted leading-relaxed">
          Booking confirmed and the transaction is saved to your rentals.
        </p>

        {/* Booking & Transaction Card */}
        <div className="mt-6 flex flex-col gap-3 rounded-[16px] border border-border bg-raised/50 p-4 sm:p-5 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <p className="font-semibold text-foreground">Hydraulic Excavator 20T</p>
              <p className="text-xs text-muted">21–23 Nov · 1 unit</p>
            </div>
            <Badge variant="success">Paid</Badge>
          </div>

          <div className="flex justify-between text-muted">
            <span>Booking ID</span>
            <span className="font-mono text-foreground">{bookingId}</span>
          </div>

          <div className="flex justify-between text-muted">
            <span>Transaction</span>
            <span className="font-mono text-foreground">pi_3QxF…8kLm</span>
          </div>

          <div className="flex items-baseline justify-between border-t border-border pt-3 mt-1">
            <span className="font-semibold text-foreground">Total paid</span>
            <span className="font-mono text-lg font-bold text-primary">৳55,500</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" asChild className="flex-1">
            <Link href="/dashboard">View my rentals</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/equipment">Keep browsing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
