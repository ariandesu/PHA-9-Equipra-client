import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    num: "01",
    question: "How is my total worked out?",
    answer:
      "Rate × billing blocks × quantity — by day, by started week, or by each started 30-day block, all shown live before you pay.",
  },
  {
    num: "02",
    question: "Is checkout safe?",
    answer:
      "Stripe Checkout moves the money. Equipra never sees or stores card numbers; the transaction ID is kept once Stripe confirms.",
  },
  {
    num: "03",
    question: "Who checks new listings?",
    answer:
      "Owners send photos, specs and terms. Nothing goes live until an admin has looked it over — new rows wait as Pending.",
  },
  {
    num: "04",
    question: "What if my dates are taken?",
    answer:
      "Your exact dates are matched against confirmed bookings for the same gear before any payment page opens.",
  },
  {
    num: "05",
    question: "Can I shortlist gear?",
    answer:
      "Yes — tap the heart on any listing. Shortlists sit in your customer dashboard.",
  },
  {
    num: "06",
    question: "What happens at the end?",
    answer:
      "A scheduled job flips the hire to Completed past the end date, for you and the owner alike.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative w-full py-20 sm:py-28 scroll-mt-20">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-10 sm:gap-14 px-4 text-left">
        {/* Header */}
        <div className="flex flex-col items-start gap-2 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
            <span aria-hidden="true">●</span> FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
            Common questions, answered.
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
