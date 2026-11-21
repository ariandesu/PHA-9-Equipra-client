"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import AnimatedTooltip from "@/components/fx/animated-tooltip";
import { formatBDT } from "@/lib/money";
import "@/components/fx/fx.css";

const OWNERS_STACK = [
  { id: 1, name: "Riverbank Plant", initials: "RP", bg: "#FF6A2B", text: "#FFFFFF" },
  { id: 2, name: "FrameCraft Studio", initials: "FS", bg: "#1F1F1F", text: "#FFFFFF" },
  { id: 3, name: "StageLine Events", initials: "SE", bg: "#0284C7", text: "#FFFFFF" },
  { id: 4, name: "VoltEdge Power", initials: "VP", bg: "#FFFFFF", text: "#0A0A0A" },
  { id: 5, name: "GreenField Agro", initials: "GA", bg: "#2A2A2A", text: "#FFFFFF" },
];

const TRANSACTIONS = [
  { item: "Bulldozer 15T · 3 days", txId: "pi_3QxF…8kLm", amount: 59250 },
  { item: "Video kit · 4 days", txId: "pi_3QwA…2pQz", amount: 21600 },
  { item: "Mini truck · 1 week", txId: "pi_3QvT…9sRt", amount: 27500 },
  { item: "PA pair · 1 day", txId: "pi_3QuK…4mNb", amount: 7400 },
];

const PERIOD_ROWS = [
  { label: "Daily", width: "20%", duration: "1–6 DAYS" },
  { label: "Weekly", width: "45%", duration: "1–4 WKS" },
  { label: "Monthly", width: "85%", duration: "1–12 MO" },
];

const PRICE_BARS = [
  { label: "Buy outright", cost: "৳1.2 Cr", height: "75%", highlight: false },
  { label: "Bank loan / yr", cost: "৳28 L", height: "45%", highlight: false },
  { label: "Rent 30 days", cost: "৳5.5 L", height: "20%", highlight: true },
];

export default function BentoGrid() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="relative w-full py-20 sm:py-28 scroll-mt-20">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12 sm:gap-16 px-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
            <span aria-hidden="true">●</span> WHY CHOOSE EQUIPRA
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
            Owning every machine is expensive.
            <br />
            Hiring ours is simple.
          </h2>
        </div>

        {/* 6-Col Bento Grid (4+2 on row 1, 2+4 on row 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Tile 1: Affordable rates (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-[22px] border border-border bg-surface p-6 sm:p-7 shadow-sm">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Fair rates</h3>
              <p className="mt-1 text-sm text-muted max-w-md">
                Pay by the day, week or month — a slice of the purchase price, with no hidden fees.
              </p>
            </div>
            <div className="relative mt-6 flex h-48 sm:h-56 items-end justify-around rounded-xl border border-border/60 bg-raised/30 p-2 sm:p-4 pb-3 overflow-hidden">
              <div aria-hidden="true" className="fx-dots pointer-events-none absolute inset-0 opacity-40" />
              {PRICE_BARS.map((bar) => (
                <div key={bar.label} className="relative z-10 flex h-full w-20 sm:w-24 flex-col items-center justify-end">
                  <div className="flex w-12 sm:w-20 flex-col items-center justify-end h-28 sm:h-36">
                    <span className={`mb-1 font-mono text-[11px] sm:text-xs font-semibold ${bar.highlight ? "text-accent" : "text-foreground"}`}>
                      {bar.cost}
                    </span>
                    <motion.div
                      style={{ height: bar.height, transformOrigin: "bottom" }}
                      initial={reduced ? undefined : { scaleY: 0 }}
                      whileInView={reduced ? undefined : { scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`w-full rounded-t-lg ${bar.highlight ? "bg-gradient-to-t from-accent to-accent-2 shadow-lg shadow-accent/25" : "bg-border-strong dark:bg-[#1F1F1F] border-t border-x border-border/30 dark:border-white/5"}`}
                    />
                  </div>
                  <span className={`mt-2 font-mono text-[10px] sm:text-[11px] text-center leading-tight ${bar.highlight ? "font-semibold text-foreground" : "text-muted"}`}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tile 2: Verified owners (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between rounded-[22px] border border-border bg-surface p-6 sm:p-7 shadow-sm">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Checked owners</h3>
              <p className="mt-1 text-sm text-muted">Every listing is looked over and cleared by an admin first.</p>
            </div>
            <div className="my-8 flex flex-col items-center justify-center">
              <AnimatedTooltip items={OWNERS_STACK} />
              <div className="mt-6 flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3.5 py-1 text-xs font-medium text-success">
                <Check className="size-3.5" aria-hidden="true" />
                <span>100% admin-reviewed</span>
              </div>
            </div>
          </div>

          {/* Tile 3: Flexible periods (2 cols) */}
          <div className="lg:col-span-2 flex flex-col rounded-[22px] border border-border bg-surface p-6 sm:p-7 shadow-sm">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Your schedule</h3>
              <p className="mt-1 text-sm text-muted">A two-day shoot or a half-year site.</p>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {PERIOD_ROWS.map((period) => (
                <div key={period.label} className="flex items-center justify-between gap-3 rounded-full border border-border bg-raised/40 px-3.5 py-2">
                  <span className="text-xs font-semibold text-foreground w-14">{period.label}</span>
                  <div className="relative h-2 flex-1 rounded-full bg-border overflow-hidden">
                    <motion.div
                      style={{ width: period.width }}
                      initial={reduced ? undefined : { width: 0 }}
                      whileInView={reduced ? undefined : { width: period.width }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                    />
                  </div>
                  <span className="font-mono text-[11px] text-muted w-14 text-right">{period.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tile 4: Secure payments (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-[22px] border border-border bg-surface p-6 sm:p-7 shadow-sm">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Safe checkout</h3>
              <p className="mt-1 text-sm text-muted max-w-xl">
                Stripe moves the money. Every status and transaction ID lands in your dashboard on its own.
              </p>
            </div>
            <div className="relative mt-6 overflow-hidden rounded-xl border border-border/80 bg-raised/40 p-3 h-44">
              <div className={reduced ? "flex flex-col gap-2" : "fx-scroll-transactions flex flex-col gap-2"}>
                {[...TRANSACTIONS, ...TRANSACTIONS].map((tx, idx) => {
                  const isDup = idx >= TRANSACTIONS.length;
                  return (
                    <div
                      key={`${tx.txId}-${idx}`}
                      aria-hidden={isDup ? "true" : undefined}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-surface/80 px-3.5 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-5 items-center justify-center rounded-full bg-success/20 text-success">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{tx.item}</p>
                          <p className="font-mono text-[10px] text-muted">{tx.txId}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-foreground">{formatBDT(tx.amount)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted">
              PCI-DSS · 3D SECURE · INSTANT RECEIPTS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
