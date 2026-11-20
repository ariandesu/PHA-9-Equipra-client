"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

function StepOne() {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-border bg-raised/50 dark:bg-[#0E0E0E] p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-1.5 text-xs">
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-foreground">
          <Search className="size-3.5 text-muted" aria-hidden="true" />
          excavator · Gazipur
        </span>
        <span className="font-mono text-[10px] text-muted uppercase">3 RESULTS</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
          <Image fill src="https://images.unsplash.com/photo-1747004066130-c6531b74d353?w=600&q=75&auto=format&fit=crop" alt="Excavator" className="object-cover" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
          <Image fill src="https://images.unsplash.com/photo-1758965285803-1cdd3371563b?w=600&q=75&auto=format&fit=crop" alt="Demolition excavator" className="object-cover" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
          <Image fill src="https://images.unsplash.com/photo-1778066994998-97f74a5bf901?w=600&q=75&auto=format&fit=crop" alt="Site excavator" className="object-cover" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-primary font-medium">Construction</span>
        <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-muted">Daily</span>
        <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-muted">৳10k–25k</span>
        <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-muted">Available</span>
      </div>
    </div>
  );
}

function StepTwo() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[20px] border border-border bg-raised/50 dark:bg-[#0E0E0E] p-4 sm:p-5 shadow-xl">
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((d) => (
          <span
            key={d}
            className={cn(
              "flex h-7 items-center justify-center rounded-md font-mono text-[11px]",
              d >= 21 && d <= 23 ? "bg-primary font-semibold text-primary-foreground" : "text-muted",
            )}
          >
            {d}
          </span>
        ))}
      </div>
      <div className="flex flex-col justify-between border-t border-border pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4 text-xs">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-muted">
            <span>Rate</span>
            <span className="font-mono text-foreground font-medium">৳18,500 / day</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Duration</span>
            <span className="font-medium text-foreground">3 days</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Quantity</span>
            <span className="font-medium text-foreground">× 1</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-mono text-base font-bold text-primary">৳55,500</span>
          </div>
        </div>
        <p className="flex items-center gap-1 text-[11px] text-success pt-2">
          <Check className="size-3.5" aria-hidden="true" />
          <span>2 of 2 units available</span>
        </p>
      </div>
    </div>
  );
}

function StepThree() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-border bg-raised/50 dark:bg-[#0E0E0E] p-5 sm:p-6 shadow-xl">
      <div className="w-full max-w-sm rounded-xl border border-border dark:border-white/10 bg-surface dark:bg-black/60 p-4 backdrop-blur shadow-md">
        <div className="flex items-center justify-between border-b border-border dark:border-white/10 pb-2.5 text-xs">
          <span className="font-semibold text-foreground dark:text-white">Equipra Checkout</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">SECURED BY STRIPE</span>
        </div>
        <div className="py-3 font-mono text-sm tracking-widest text-muted">•••• •••• •••• 4242</div>
        <div className="flex items-baseline justify-between border-t border-border dark:border-white/10 pt-2.5 text-xs">
          <span className="text-muted">Total due</span>
          <span className="font-mono text-base font-bold text-foreground dark:text-white">৳55,500</span>
        </div>
        <div className="mt-3 flex w-full items-center justify-center rounded-full bg-foreground text-background py-2 text-xs font-bold transition-opacity hover:opacity-90">
          Pay ৳55,500
        </div>
      </div>
    </div>
  );
}

function StepFour() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-border bg-surface shadow-xl">
      <Image
        fill
        src="https://images.unsplash.com/photo-1737513915304-a298b4fd5865?w=1200&q=75&auto=format&fit=crop"
        alt="Cargo van delivery"
        className="object-cover"
        style={{ objectPosition: "60% 88%" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[11px] text-white backdrop-blur">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          Out for delivery · Uttara, 9:30 am
        </span>
        <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[11px] text-[#D4D4D4] backdrop-blur">
          Auto-completes after 23 Nov
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  { num: "01", title: "Browse & compare", description: "Search by name or location, then filter by category, rental type, price range and availability — all on the server.", card: <StepOne /> },
  { num: "02", title: "Pick your dates", description: "Choose start and end dates and quantity. The total is calculated and availability checked before you pay.", card: <StepTwo /> },
  { num: "03", title: "Pay with Stripe", description: "Secure Stripe Checkout confirms the booking and records the transaction in the payments collection.", card: <StepThree /> },
  { num: "04", title: "Use & return", description: "Gear arrives at your address. When the end date passes, a scheduled job marks the rental completed.", card: <StepFour /> },
];

export default function Timeline() {
  const containerRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="relative w-full py-20 sm:py-28 scroll-mt-20">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12 sm:gap-16 px-4">
        <div className="flex flex-col items-start gap-2 max-w-2xl text-left">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
            <span aria-hidden="true">●</span> HOW IT WORKS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
            From search to site in four steps.
          </h2>
          <p className="text-sm sm:text-base text-muted">
            Availability checks, pricing and payment all happen before the gear leaves the yard.
          </p>
        </div>

        <div ref={containerRef} className="relative pl-6 sm:pl-10">
          <div aria-hidden="true" className="absolute left-2 sm:left-3 top-3 bottom-8 w-[2px] bg-border" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reduced ? 1 : scaleY }}
            className="absolute left-2 sm:left-3 top-3 bottom-8 w-[2px] origin-top bg-gradient-to-b from-accent to-accent-2"
          />

          <div className="flex flex-col gap-14 sm:gap-20">
            {STEPS.map((step) => (
              <div key={step.num} className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
                <div aria-hidden="true" className="absolute -left-6 sm:-left-10 top-1.5 flex size-5 sm:size-6 -translate-x-[9px] sm:-translate-x-[11px] items-center justify-center rounded-full border border-border bg-background">
                  <span className="size-2 rounded-full bg-primary" />
                </div>
                <div className="lg:col-span-5 flex flex-col items-start text-left lg:sticky lg:top-32">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57]">STEP {step.num}</span>
                  <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">{step.description}</p>
                </div>
                <div className="lg:col-span-7 w-full">{step.card}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
