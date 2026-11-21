"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Printer } from "lucide-react";
import DotBackground from "@/components/fx/dot-background";
import ReceiptPrinter from "@/components/payment/receipt-printer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConfirmPayment } from "@/lib/data/hooks";

function PaymentSuccessContent() {
  const reduced = useReducedMotion();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const sessionId = searchParams.get("session_id");
  const { mutateAsync: confirmSession } = useConfirmPayment();

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(
    sessionId || isDemo ? "confirming" : "idle"
  );
  const [printed, setPrinted] = useState(false);

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

  // Demo mode (?demo=1): brief confirming buzz before printing the demo receipt.
  useEffect(() => {
    if (!isDemo || sessionId) return undefined;
    const timer = setTimeout(() => {
      setStatus("confirmed");
    }, reduced ? 0 : 650);
    return () => clearTimeout(timer);
  }, [isDemo, sessionId, reduced]);

  const effectiveStatus =
    reduced && isDemo && !sessionId ? "confirmed" : status;
  const booking = result?.booking || null;
  const showActions =
    Boolean(reduced) ||
    printed ||
    effectiveStatus === "error" ||
    effectiveStatus === "idle";

  const headline =
    effectiveStatus === "error"
      ? "Payment confirmation failed"
      : "Payment successful";

  const copy =
    effectiveStatus === "confirming"
      ? "Confirming your payment with the server…"
      : effectiveStatus === "error"
        ? result?.message ||
          "We could not confirm this payment. Contact support if you were charged."
        : "Booking confirmed and the transaction is saved to your rentals.";

  const badgeLabel =
    booking?.paymentStatus === "paid"
      ? "Paid"
      : effectiveStatus === "error"
        ? "Unverified"
        : "Confirmed";

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8 lg:py-10">
      <div className="relative w-full max-w-lg lg:max-w-3xl overflow-hidden rounded-[24px] border border-border bg-surface px-5 py-7 sm:p-9 shadow-2xl text-center">
        <DotBackground className="fx-dots-success" />

        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-8 lg:items-end">
          <div>
            {isDemo && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-left">
                <Badge variant="warning" className="px-3 py-1 font-mono text-xs">
                  Demo mode — no payment taken
                </Badge>
                <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-muted">
                  MOCK TRANSACTION
                </span>
              </div>
            )}

            <ReceiptPrinter
              status={effectiveStatus}
              booking={booking}
              sessionId={sessionId}
              isDemo={isDemo}
              onPrinted={() => setPrinted(true)}
            />
          </div>

          <div>
            <div className="mt-2 flex flex-col items-center">
              {(effectiveStatus === "confirmed" || effectiveStatus === "error") && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={
                    showActions ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
                  }
                  transition={reduced ? { duration: 0 } : { duration: 0.25 }}
                  className="mb-3"
                >
                  <Badge
                    variant={effectiveStatus === "error" ? "danger" : "success"}
                  >
                    {badgeLabel}
                  </Badge>
                </motion.div>
              )}

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {headline}
              </h1>
              <p className="mt-1.5 max-w-md text-sm text-muted leading-relaxed">
                {copy}
              </p>
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={showActions ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={reduced ? { duration: 0 } : { duration: 0.25, delay: 0.05 }}
              className="mt-8 flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" asChild className="flex-1">
                  <Link href="/dashboard/rentals">View my rentals</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/equipment">Keep browsing</Link>
                </Button>
              </div>

              {effectiveStatus === "confirmed" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                  className="mx-auto"
                >
                  <Printer className="size-4" aria-hidden="true" />
                  Print receipt
                </Button>
              )}
            </motion.div>
          </div>
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
