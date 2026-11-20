"use client";

import { useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import { useReviews } from "@/lib/data/hooks";
import { cn } from "@/lib/utils";
import "@/components/fx/fx.css";

const AVATAR_ACCENTS = {
  TA: "bg-[#FF6A2B] text-white border-transparent",
  FK: "bg-[#0284C7] dark:bg-[#38BDF8] text-white dark:text-black border-transparent",
  MH: "bg-[#FF6A2B] text-white border-transparent",
};

function ReviewCard({ review }) {
  const initials = review.name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const commentText = review.comment.replace(/^“|”$/g, "");
  const avatarStyle = AVATAR_ACCENTS[initials] || "border-border bg-raised text-foreground";

  return (
    <div className="flex w-[320px] sm:w-[400px] shrink-0 flex-col justify-between rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm transition-colors hover:border-border-strong">
      <div>
        <div
          role="img"
          aria-label={`Rated ${review.rating} out of 5 stars`}
          className="flex items-center gap-1 text-primary"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i < review.rating ? "fill-current text-primary" : "text-border fill-transparent",
              )}
              aria-hidden="true"
            />
          ))}
        </div>

        <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-foreground">
          &ldquo;{commentText}&rdquo;
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div className="flex items-center gap-2.5">
          <div className={cn("flex size-9 items-center justify-center rounded-full border font-mono text-xs font-bold", avatarStyle)}>
            {initials}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{review.name}</p>
            <p className="text-xs text-muted">{review.role}</p>
          </div>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-wider text-muted px-2 py-0.5 rounded border border-border bg-raised">
          {review.equipmentType}
        </span>
      </div>
    </div>
  );
}

export default function Reviews() {
  const reduced = useReducedMotion();
  const { data: reviewsRes } = useReviews();
  const allReviews = reviewsRes?.data ?? [];

  const row1 = allReviews.slice(0, 3);
  const row2 = allReviews.slice(3, 6);

  return (
    <section className="relative w-full overflow-hidden py-20 sm:py-28">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 px-4 text-center mb-10 sm:mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary dark:text-[#FF8A57] flex items-center gap-1.5">
          <span aria-hidden="true">●</span> CUSTOMER REVIEWS
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-[-0.045em] bg-gradient-to-b from-foreground to-muted bg-clip-text text-transparent leading-[1.05]">
          Rented, used, returned — and rated 4.8.
        </h2>
      </div>

      {reduced ? (
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {allReviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Row 1 moving left */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Customer reviews, row 1"
            className="fx-cards-row relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <div className="fx-cards-left flex w-max gap-6 py-2">
              <div className="flex gap-6">
                {row1.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
              <div aria-hidden="true" inert className="flex gap-6">
                {[...row1, ...row1].map((rev, idx) => (
                  <ReviewCard key={`${rev.id}-dup-${idx}`} review={rev} />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 moving right */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Customer reviews, row 2"
            className="fx-cards-row relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <div className="fx-cards-right flex w-max gap-6 py-2">
              <div className="flex gap-6">
                {row2.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
              <div aria-hidden="true" inert className="flex gap-6">
                {[...row2, ...row2].map((rev, idx) => (
                  <ReviewCard key={`${rev.id}-dup-${idx}`} review={rev} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
