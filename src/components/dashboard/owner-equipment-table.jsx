"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Edit3, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { formatBDT } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMyEquipment, useDeleteEquipment } from "@/lib/data/hooks";

const STATUS_VARIANTS = {
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

export default function OwnerEquipmentTable() {
  const { data: equipRes, isPending } = useMyEquipment();
  const deleteEquip = useDeleteEquipment();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const items = equipRes?.items ?? (Array.isArray(equipRes) ? equipRes : []);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteEquip.mutateAsync(deleteTarget.id);
      toast.success("Equipment listing deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete equipment");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / MY EQUIPMENT</p>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My equipment</h1>
            <span className="rounded-full border border-border bg-raised px-2.5 py-0.5 font-mono text-xs text-muted">
              {items.length} LISTINGS
            </span>
          </div>
        </div>

        <Button variant="action" asChild className="self-start sm:self-auto">
          <Link href="/dashboard/owner/add" className="flex items-center gap-1.5">
            <PlusCircle className="size-4" />
            <span>Add equipment</span>
          </Link>
        </Button>
      </div>

      {/* Table Card */}
      <div className="rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Rental price</th>
                <th className="py-3 px-3">Available qty</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    Loading equipment listings...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    <p className="text-sm font-medium text-foreground">No equipment listed yet</p>
                    <p className="mt-1 text-xs">Start listing heavy machinery and equipment to earn rental income.</p>
                    <Button variant="action" size="sm" asChild className="mt-4">
                      <Link href="/dashboard/owner/add">Add equipment</Link>
                    </Button>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-[8px] border border-border bg-raised">
                          {item.image && (
                            <Image fill src={item.image} alt={item.name} sizes="44px" className="object-cover" />
                          )}
                        </div>
                        <span className="font-semibold line-clamp-1">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-muted whitespace-nowrap">{item.category}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {formatBDT(item.price)}
                      <span className="text-xs font-normal text-muted">/{item.rentalType === "weekly" ? "wk" : item.rentalType === "monthly" ? "mo" : "day"}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-foreground whitespace-nowrap">{item.quantity}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <Badge variant={STATUS_VARIANTS[item.status] || "neutral"}>
                        {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild className="h-8 px-2.5 text-xs">
                          <Link href={`/dashboard/owner/equipment/${item.id}/edit`}>
                            <Edit3 className="size-3 mr-1" />
                            <span>Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs text-muted hover:text-foreground">
                          <Link href={`/equipment/${item.id}`}>
                            <ExternalLink className="size-3.5" />
                          </Link>
                        </Button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${item.name}`}
                          className="flex size-8 items-center justify-center rounded-[8px] border border-border text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md bg-surface border-border p-6 rounded-[22px]">
          <DialogTitle className="text-lg font-bold text-foreground">Delete equipment listing?</DialogTitle>
          <DialogDescription className="text-sm text-muted mt-2 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? Listings with upcoming paid rentals cannot be deleted.
          </DialogDescription>
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-danger text-white hover:bg-danger/90"
            >
              {isDeleting ? "Deleting..." : "Delete listing"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
