"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import Meteors from "@/components/fx/meteors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConfirmPayment } from "@/lib/data/hooks";
import { formatBDT, formatDate } from "@/lib/money";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const sessionId = searchParams.get("session_id");
  const { mutateAsync: confirmSession } = useConfirmPayment();

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(sessionId ? "confirming" : "idle");

  // 02 §5: the success page confirms the Stripe session exactly once.
  useEffect(() => {
    if (!sessionId) return undefined;
    let cancelled = false;

    confirmSession(sessionId)
      .then((res) => {
        if (cancelled) return;
        setResult(res?.data || null);
        setStatus("confirmed");
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus("error");
        setResult({ message: error?.message || "Could not confirm the payment." });
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, confirmSession]);

  const booking = result?.booking || null;

  const headline =
    status === "error" ? "Payment confirmation failed" : "Payment successful";

  const copy =
    status === "confirming"
      ? "Confirming your payment with the server…"
      : status === "error"
        ? result?.message || "We could not confirm this payment. Contact support if you were charged."
        : "Booking confirmed and the transaction is saved to your rentals.";

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-border bg-surface p-7 sm:p-9 shadow-2xl text-left">
        <Meteors number={12} />

        {isDemo && (
          <div className="mb-6 flex items-center justify-between">
            <Badge variant="warning" className="px-3 py-1 font-mono text-xs">
              Demo mode — no payment taken
            </Badge>
            <span className="font-mono text-[11px] text-muted">MOCK TRANSACTION</span>
          </div>
        )}

        <div className="flex size-14 items-center justify-center rounded-full border border-success/35 bg-success/15 text-success mb-5">
          <Check className="size-7" aria-hidden="true" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{headline}</h1>
        <p className="mt-1.5 text-sm text-muted leading-relaxed">{copy}</p>

        <div className="mt-6 flex flex-col gap-3 rounded-[16px] border border-border bg-raised/50 p-4 sm:p-5 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <p className="font-semibold text-foreground">
                {booking?.equipment?.name || "Equipment rental"}
              </p>
              <p className="text-xs text-muted">
                {booking
                  ? `${formatDate(booking.startDate)} – ${formatDate(booking.endDate)} · ${booking.quantity} unit(s)`
                  : "Dates confirmed by the server on payment"}
              </p>
            </div>
            <Badge variant={status === "error" ? "danger" : "success"}>
              {booking?.paymentStatus === "paid"
                ? "Paid"
                : status === "error"
                  ? "Unverified"
                  : "Confirmed"}
            </Badge>
          </div>

          <div className="flex justify-between text-muted">
            <span>Transaction</span>
            <span className="font-mono text-foreground">
              {booking?.transactionId || sessionId || "demo"}
            </span>
          </div>

          <div className="flex items-baseline justify-between border-t border-border pt-3 mt-1">
            <span className="font-semibold text-foreground">Total paid</span>
            <span className="font-mono text-lg font-bold text-primary">
              {booking ? formatBDT(booking.totalAmount) : isDemo ? formatBDT(55500) : "—"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="primary" asChild className="flex-1">
            <Link href="/dashboard/rentals">View my rentals</Link>
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
