"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { formatBDT, formatDate } from "@/lib/money";

// 16 serrated triangles along the TOP edge: the paper tears off as it leaves the
// machine, so the ragged edge is the end that came out last.
const ZIGZAG_CLIP = (() => {
  const teeth = 16;
  const step = 100 / teeth;
  const points = ["0% 100%", "0% 7px"];
  for (let i = 0; i < teeth; i += 1) {
    const valley = (i * step).toFixed(3);
    const peak = (i * step + step / 2).toFixed(3);
    points.push(`${valley}% 7px`, `${peak}% 0%`);
  }
  points.push("100% 7px", "100% 100%");
  return `polygon(${points.join(", ")})`;
})();

// Paper starts fully hidden inside the machine and rises in 8 thermal steps with
// a 1px horizontal jitter, pausing briefly between each step.
const FEED_Y = [
  "100%",
  "87.5%", "87.5%",
  "75%", "75%",
  "62.5%", "62.5%",
  "50%", "50%",
  "37.5%", "37.5%",
  "25%", "25%",
  "12.5%", "12.5%",
  "0%",
];
const FEED_X = [0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 0];
const FEED_TIMES = [
  0,
  0.08, 0.125,
  0.205, 0.25,
  0.33, 0.375,
  0.455, 0.5,
  0.58, 0.625,
  0.705, 0.75,
  0.83, 0.875,
  1,
];

const BARCODE_BG =
  "repeating-linear-gradient(90deg, #0A0A0A 0 2px, transparent 2px 4px, #0A0A0A 4px 5px, transparent 5px 8px, #0A0A0A 8px 11px, transparent 11px 13px, #0A0A0A 13px 14px, transparent 14px 17px, #0A0A0A 17px 20px, transparent 20px 22px)";

function truncateMiddle(value) {
  const str = String(value);
  if (str.length <= 18) return str;
  return `${str.slice(0, 8)}…${str.slice(-6)}`;
}

function buildLines(booking, sessionId, isDemo, printedAt) {
  const eq = booking?.equipment;
  const total = booking?.totalAmount ?? (isDemo ? 55500 : null);
  const rawTxn = booking?.transactionId || sessionId || (isDemo ? "demo" : null);

  const detailRows = [];
  if (eq?.name) {
    detailRows.push({ key: "name", node: <span className="block font-semibold leading-snug text-[#0A0A0A]">{eq.name}</span> });
  }
  if (booking?.startDate && booking?.endDate) {
    detailRows.push({
      key: "dates",
      node: <span className="block text-[#525252]">{formatDate(booking.startDate)} – {formatDate(booking.endDate)}</span>,
    });
  }
  if (booking?.quantity != null && booking?.days != null) {
    detailRows.push({
      key: "qty",
      node: <span className="block text-[#525252]">{booking.quantity} unit(s) × {booking.days} day(s)</span>,
    });
  }
  if (eq?.price != null && eq?.rentalType) {
    detailRows.push({
      key: "rate",
      node: (
        <div className="flex items-baseline justify-between gap-2 text-[#525252]">
          <span>Rate</span>
          <span>{formatBDT(eq.price)} / {eq.rentalType}</span>
        </div>
      ),
    });
  }

  const rows = [
    { key: "brand", node: <span className="block text-center text-[13px] font-bold tracking-[0.18em] text-[#0A0A0A]">EQUIPRA</span> },
    { key: "sub", node: <span className="block text-center text-[10px] tracking-[0.14em] text-[#525252]">RENTAL RECEIPT</span> },
    { key: "div1", node: <span aria-hidden="true" className="block overflow-hidden whitespace-nowrap text-center text-[#A3A3A3]">----------------------------</span> },
    ...detailRows,
  ];

  if (detailRows.length > 0) {
    rows.push({
      key: "div2",
      node: <span aria-hidden="true" className="block overflow-hidden whitespace-nowrap text-center text-[#A3A3A3]">----------------------------</span>,
    });
  }

  if (total != null) {
    rows.push({
      key: "total",
      node: (
        <div className="flex items-baseline justify-between gap-2 text-[13px] font-bold text-[#0A0A0A]">
          <span>TOTAL PAID</span>
          <span>{formatBDT(total)}</span>
        </div>
      ),
    });
  }
  if (rawTxn) {
    rows.push({
      key: "txn",
      node: (
        <div className="flex items-baseline justify-between gap-2 text-[#525252]">
          <span>Txn</span>
          <span>{truncateMiddle(rawTxn)}</span>
        </div>
      ),
    });
  }

  rows.push({
    key: "paid",
    node: <span className="block text-[#525252]">{formatDate(printedAt)} · PAID</span>,
  });

  if (isDemo) {
    rows.push({
      key: "demo",
      node: <span className="block text-center font-semibold tracking-wider text-[#C2410C]">DEMO — NO CHARGE</span>,
    });
  }

  rows.push({
    key: "barcode",
    node: <div aria-hidden="true" className="my-1.5 h-8 w-full opacity-90" style={{ backgroundImage: BARCODE_BG }} />,
  });
  rows.push({
    key: "thanks",
    node: <span className="block text-center text-[10px] tracking-[0.12em] text-[#525252]">THANK YOU FOR RENTING</span>,
  });

  return rows;
}

export default function ReceiptPaper({ booking, sessionId, isDemo, onPrinted }) {
  const reduced = useReducedMotion();
  const [settled, setSettled] = useState(false);
  const [printedAt] = useState(() => new Date());

  const lines = buildLines(booking, sessionId, isDemo, printedAt);

  return (
    <motion.div
      data-receipt-paper
      animate={settled && !reduced ? { rotate: -2, y: -4 } : { rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
      style={{ transformOrigin: "50% 100%" }}
      className="w-[198px] border-x border-t border-[var(--pos-paper-edge)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)]"
    >
      <motion.div
        initial={reduced ? false : { x: 0, y: "100%" }}
        animate={reduced ? { x: 0, y: "0%" } : { x: FEED_X, y: FEED_Y }}
        transition={
          reduced ? { duration: 0 } : { duration: 1.6, times: FEED_TIMES, ease: "linear" }
        }
        onAnimationComplete={() => {
          if (!reduced && !settled) {
            setSettled(true);
            onPrinted?.();
          }
        }}
        style={{ clipPath: ZIGZAG_CLIP }}
        className="w-full bg-[#FAFAFA] px-4 pb-6 pt-5 text-left font-mono text-[11px] leading-relaxed text-[#0A0A0A]"
      >
        <ul className="flex flex-col gap-1" aria-label="Payment receipt">
          {lines.map((line, index) => (
            <motion.li
              key={line.key}
              initial={reduced ? false : { opacity: 0, filter: "blur(2px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.18, delay: index * 0.12 }
              }
            >
              {line.node}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
