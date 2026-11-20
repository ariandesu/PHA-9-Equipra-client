"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import EquipmentGallery from "@/components/details/equipment-gallery";
import EquipmentInfo from "@/components/details/equipment-info";
import { useEquipment } from "@/lib/data/hooks";

export default function EquipmentDetailPage({ params }) {
  const { id } = use(params);
  const { data: itemRes, isPending, isError } = useEquipment(id);
  const item = itemRes?.data;

  if (!isPending && (isError || !item)) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <Link href="/equipment" className="hover:text-foreground transition-colors">
          All equipment
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground truncate max-w-[200px] sm:max-w-none">
          {item?.name || "Equipment details"}
        </span>
      </nav>

      {isPending || !item ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-[4/3] rounded-[22px] bg-raised" />
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="h-6 w-24 rounded-full bg-raised" />
            <div className="h-10 w-full rounded bg-raised" />
            <div className="h-4 w-32 rounded bg-raised" />
            <div className="h-12 w-48 rounded bg-raised mt-4" />
            <div className="h-32 w-full rounded-[16px] bg-raised mt-4" />
          </div>
        </div>
      ) : (
        <>
          {/* Main 2-Column: Gallery + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 w-full">
              <EquipmentGallery item={item} />
            </div>
            <div className="lg:col-span-5 w-full">
              <EquipmentInfo item={item} />
            </div>
          </div>

          {/* Bottom Cards: Description & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Description Card */}
            <div className="rounded-[22px] border border-border bg-surface p-6 sm:p-7 shadow-sm text-left">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                {item.description || "Comprehensive specifications and details provided by verified equipment owner."}
              </p>
            </div>

            {/* Terms Card */}
            <div className="rounded-[22px] border border-border bg-surface p-6 sm:p-7 shadow-sm text-left">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Rental terms &amp; conditions
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                {item.terms || "Standard rental agreement applies. Fuel and operator conditions per listing agreement."}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
