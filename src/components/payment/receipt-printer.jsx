"use client";

import { useCallback, useState } from "react";
import POSTerminal, { SLOT, TERMINAL_ASPECT, TERMINAL_WIDTH } from "@/components/payment/pos-terminal";
import ReceiptPaper from "@/components/payment/receipt-paper";
import { BurstConfetti, BurstRings } from "@/components/payment/success-burst";
import { usePrinterScale } from "@/components/payment/use-printer-scale";
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
  const isConfirmed = status === "confirmed";

  const scale = usePrinterScale();
  const terminalWidth = TERMINAL_WIDTH * scale;
  const terminalHeight = terminalWidth * TERMINAL_ASPECT;
  const slotOffset = (SLOT.y / 100) * terminalHeight;

  const [paperHeight, setPaperHeight] = useState(0);

  // Measure the receipt once it mounts so the space above the terminal matches
  // what actually prints; without it the bare card would jump and the torn top
  // edge could be clipped by the card's rounded frame. offsetHeight ignores the
  // visual scale, so the reserved space multiplies by scale explicitly.
  const measurePaper = useCallback((node) => {
    if (!node) return undefined;
    const sync = () => setPaperHeight(node.offsetHeight);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scaledPaper = paperHeight * scale;
  const reserved = isConfirmed && paperHeight ? Math.max(scaledPaper - slotOffset, 0) : 0;
  const clipHeight = Math.max(scaledPaper, terminalHeight);
  const screenY = reserved + terminalHeight * 0.417;
  const burstY = reserved + slotOffset;

  return (
    <div className="pos-device flex w-full flex-col items-center">
      <div className="relative flex flex-col items-center" style={{ width: terminalWidth }}>
        <div aria-hidden="true" style={{ height: reserved, width: "100%" }} />

        <POSTerminal status={status} scale={scale} amount={total != null ? formatBDT(total) : null} />

        {isConfirmed && (
          <div
            data-receipt-clip
            className="pointer-events-none absolute overflow-hidden"
            style={{
              left: `${SLOT.left}%`,
              width: `calc(${SLOT.right - SLOT.left}% - 6px)`,
              bottom: terminalHeight - slotOffset,
              height: clipHeight,
            }}
          >
            {/* Bottom-anchored and scaled about the bottom edge, so the paper
                rises out of the slot while its layout stays at 150px. */}
            <div
              data-receipt-scale
              className="absolute inset-x-0 bottom-0 flex justify-center"
              ref={measurePaper}
              style={{ transform: `scale(${scale})`, transformOrigin: "50% 100%" }}
            >
              <ReceiptPaper
                booking={booking}
                sessionId={sessionId}
                isDemo={isDemo}
                onPrinted={onPrinted}
              />
            </div>
          </div>
        )}

        {isConfirmed && (
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ zIndex: 5 }}
          >
            <BurstConfetti slotY={burstY} />
          </div>
        )}
        {isConfirmed && (
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ zIndex: 20 }}
          >
            <BurstRings screenY={screenY} />
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
