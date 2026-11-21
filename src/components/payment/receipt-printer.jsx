"use client";

import { useCallback, useState } from "react";
import POSTerminal, { SLOT, TERMINAL_ASPECT, TERMINAL_WIDTH } from "@/components/payment/pos-terminal";
import ReceiptPaper from "@/components/payment/receipt-paper";
import { formatBDT } from "@/lib/money";

const TERMINAL_HEIGHT = TERMINAL_WIDTH * TERMINAL_ASPECT;
const SLOT_OFFSET = (SLOT.y / 100) * TERMINAL_HEIGHT;

export default function ReceiptPrinter({
  status,
  booking,
  sessionId,
  isDemo,
  onPrinted,
}) {
  const itemName = booking?.equipment?.name || "equipment rental";
  const total = booking?.totalAmount ?? (isDemo ? 55500 : null);
  const isConfirmed = status === "confirmed";

  const [paperHeight, setPaperHeight] = useState(0);

  // Measure the receipt once it mounts so the space above the terminal matches
  // what actually prints; without it the bare card would jump and the torn top
  // edge could be clipped by the card's rounded frame.
  const measurePaper = useCallback((node) => {
    if (!node) return undefined;
    const sync = () => setPaperHeight(node.offsetHeight);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const reserved = isConfirmed && paperHeight ? Math.max(paperHeight - SLOT_OFFSET, 0) : 0;
  const clipHeight = Math.max(paperHeight, TERMINAL_HEIGHT);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative flex flex-col items-center" style={{ width: TERMINAL_WIDTH }}>
        <div aria-hidden="true" style={{ height: reserved, width: "100%" }} />

        <POSTerminal status={status} />

        {isConfirmed && (
          <div
            data-receipt-clip
            className="pointer-events-none absolute overflow-hidden"
            style={{
              left: `${SLOT.left}%`,
              width: `calc(${SLOT.right - SLOT.left}% - 6px)`,
              bottom: TERMINAL_HEIGHT - SLOT_OFFSET,
              height: clipHeight,
            }}
          >
            {/* Bottom-anchored inside the clip so the paper rises out of the slot. */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center" ref={measurePaper}>
              <ReceiptPaper
                booking={booking}
                sessionId={sessionId}
                isDemo={isDemo}
                onPrinted={onPrinted}
              />
            </div>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {isConfirmed && total != null
          ? `Payment approved. Receipt for ${itemName}, total ${formatBDT(total)}.`
          : ""}
      </p>
    </div>
  );
}
