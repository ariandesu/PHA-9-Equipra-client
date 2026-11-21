"use client";

import { useReducedMotion } from "motion/react";
import { Shield, Sparkles, Wrench, Camera, Truck, Award } from "lucide-react";
import "@/components/fx/fx.css";

const OWNERS = [
  { name: "Riverbank Plant", icon: Wrench },
  { name: "FrameCraft Studio", icon: Camera },
  { name: "StageLine Events", icon: Sparkles },
  { name: "VoltEdge Power", icon: Shield },
  { name: "Sheba Transport", icon: Truck },
  { name: "GreenField Agro", icon: Award },
];

export default function LogoCloud() {
  const reduced = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden py-10 sm:py-14 text-center">
      <div className="mx-auto max-w-[1100px] px-4 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          TRUSTED BY VERIFIED EQUIPMENT OWNERS
        </p>
      </div>

      {reduced ? (
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-6 px-4">
          {OWNERS.map((owner) => {
            const Icon = owner.icon;
            return (
              <div
                key={owner.name}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <span>{owner.name}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="fx-marquee fx-marquee-group py-2">
            {[...OWNERS, ...OWNERS].map((owner, idx) => {
              const isDuplicate = idx >= OWNERS.length;
              const Icon = owner.icon;
              return (
                <div
                  key={`${owner.name}-${idx}`}
                  aria-hidden={isDuplicate ? "true" : undefined}
                  className="mx-4 flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition-all hover:border-border-strong hover:bg-raised hover:text-foreground"
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  <span>{owner.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
