"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/dashboard/confirm-dialog";
import AdminEquipmentActions from "@/components/dashboard/admin-equipment-actions";
import { formatBDT } from "@/lib/money";
import { useAdminEquipment, useUpdateEquipmentStatus, useDeleteEquipment } from "@/lib/data/hooks";

const TABS = [
  { id: "", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const STATUS_VARIANTS = { approved: "success", pending: "warning", rejected: "danger" };

export default function AdminEquipmentTable() {
  const [status, setStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pending, setPending] = useState(false);

  const { data: equipRes, isPending } = useAdminEquipment({ status: status || undefined, limit: 24 });
  const updateStatus = useUpdateEquipmentStatus();
  const deleteEquip = useDeleteEquipment();

  const items = equipRes?.items ?? [];
  const total = equipRes?.total ?? 0;

  async function setItemStatus(item, nextStatus) {
    try {
      await updateStatus.mutateAsync({ id: item.id, status: nextStatus });
      toast.success(`${item.name} ${nextStatus === "approved" ? "approved" : "rejected"}`);
    } catch (err) {
      toast.error(err.message || "Could not update the status");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      setPending(true);
      await deleteEquip.mutateAsync(deleteTarget.id);
      toast.success("Listing deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Could not delete the listing");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / ALL EQUIPMENT</p>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">All equipment</h1>
            <span className="rounded-full border border-border bg-raised px-2.5 py-0.5 font-mono text-xs text-muted">
              {total} LISTINGS
            </span>
          </div>
        </div>

        <div role="tablist" aria-label="Equipment status" className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id || "all"}
              type="button"
              role="tab"
              aria-selected={status === tab.id}
              onClick={() => setStatus(tab.id)}
              className={
                status === tab.id
                  ? "rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                  : "rounded-full border border-border bg-raised px-3.5 py-1.5 text-xs text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">Loading equipment…</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">
                    No listings in this status.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-[8px] border border-border bg-raised">
                          {item.image && (
                            <Image fill src={item.image} alt="" sizes="40px" className="object-cover" />
                          )}
                        </div>
                        <span className="font-semibold text-foreground line-clamp-1">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-muted whitespace-nowrap">{item.owner?.name || "—"}</td>
                    <td className="py-3.5 px-3 text-muted whitespace-nowrap">{item.category}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {formatBDT(item.price)}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={STATUS_VARIANTS[item.status] || "neutral"}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <AdminEquipmentActions item={item} onStatus={setItemStatus} onDelete={setDeleteTarget} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete listing?"
        description={
          <>
            <span className="font-semibold text-foreground">{deleteTarget?.name}</span> will be removed for its
            owner. Listings with upcoming paid bookings cannot be deleted.
          </>
        }
        confirmLabel="Delete listing"
        pendingLabel="Deleting…"
        pending={pending}
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
