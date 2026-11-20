import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    num: "01",
    question: "How is the total calculated?",
    answer:
      "Rate × billable periods × quantity — per day, per started week or per started 30 days. Shown live before you pay.",
  },
  {
    num: "02",
    question: "Is my payment secure?",
    answer:
      "Payments run through Stripe Checkout. Equipra never stores card details; the transaction ID is saved when Stripe confirms.",
  },
  {
    num: "03",
    question: "How do owners get approved?",
    answer:
      "Owners submit photos, specs and terms. Listings stay Pending until an admin approves them.",
  },
  {
    num: "04",
    question: "What if it’s already booked?",
    answer:
      "Availability is checked against paid bookings for your exact dates before checkout.",
  },
  {
    num: "05",
    question: "Can I save equipment for later?",
    answer:
      "Yes — tap the heart on any listing. Favorites live in your customer dashboard.",
  },
  {
    num: "06",
    question: "What happens when it ends?",
    answer:
      "A scheduled job marks the booking Completed after the end date for both you and the owner.",
  },
];

export default function FAQ() {
  return (
    <section className="relative w-full py-20 sm:py-28">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-10 sm:gap-14 px-4 text-left">
        {/* Header */}
        <div className="flex flex-col items-start gap-2 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
            <span aria-hidden="true">●</span> FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
            Questions before you rent?
          </h2>
        </div>

        {/* 3x2 Grid with hairline borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-[22px] border border-border overflow-hidden">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.num}
              className={cn(
                "flex flex-col p-6 sm:p-8 bg-surface transition-colors hover:bg-raised/60",
              )}
            >
              <span className="font-mono text-xs font-semibold text-primary dark:text-[#FF8A57]">
                {item.num}
              </span>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">
                {item.question}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
