"use client";

import MultiStepLoader from "@/components/fx/multi-step-loader";

const steps = [
  "Checking availability for 21–23 Nov",
  "Calculating total · ৳55,500",
  "Creating Stripe Checkout session",
  "Redirecting to secure payment",
  "Confirming booking",
];

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <MultiStepLoader steps={steps} activeIndex={2} />
    </main>
  );
}
