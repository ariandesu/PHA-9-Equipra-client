"use client";

import POSTerminal from "@/components/payment/pos-terminal";
import ReceiptPaper from "@/components/payment/receipt-paper";
import { formatBDT } from "@/lib/money";

export default function ReceiptPrinter({
  status,
  booking,
  sessionId,
  isDemo,
  onPrinted,
}) {
  const itemName = booking?.equipment?.name || "equipment rental";
  const total = booking?.totalAmount ?? (isDemo ? 55500 : null);

  return (
    <div className="flex flex-col items-center">
      <POSTerminal status={status} />

      {status === "confirmed" && (
        <div className="-mt-1 flex w-full justify-center overflow-hidden px-6 pb-10">
          <ReceiptPaper
            booking={booking}
            sessionId={sessionId}
            isDemo={isDemo}
            onPrinted={onPrinted}
          />
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {status === "confirmed" && total != null
          ? `Payment approved. Receipt for ${itemName}, total ${formatBDT(total)}.`
          : ""}
      </p>
    </div>
  );
}
