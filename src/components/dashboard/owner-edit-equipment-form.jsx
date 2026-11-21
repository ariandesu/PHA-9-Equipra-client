"use client";

import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import EquipmentForm from "@/components/dashboard/equipment-form";
import { useEquipment } from "@/lib/data/hooks";

export default function OwnerEditEquipmentForm({
  equipmentId,
  returnTo = "/dashboard/owner/equipment",
}) {
  const { data: itemRes, isPending, isError } = useEquipment(equipmentId);
  const item = itemRes?.data;

  if (!isPending && (isError || !item)) {
    notFound();
  }

  if (isPending || !item) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted animate-pulse py-12">
        <Loader2 className="size-5 animate-spin" />
        <span>Loading equipment details...</span>
      </div>
    );
  }

  return (
    <EquipmentForm
      initialData={item}
      isEdit={true}
      equipmentId={equipmentId}
      returnTo={returnTo}
    />
  );
}
