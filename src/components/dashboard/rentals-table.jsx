"use client";

import { useState } from "react";
import Link from "next/link";
import { formatBDT, formatDate } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/catalog/pagination";
import LoadError from "@/components/dashboard/load-error";
import { useMyBookings } from "@/lib/data/hooks";

const STATUS_VARIANTS = {
  confirmed: "info",
  completed: "neutral",
  pending: "warning",
  cancelled: "danger",
};

export default function RentalsTable() {
  const [page, setPage] = useState(1);
  const { data: bookingsRes, isPending, isError, refetch } = useMyBookings({ page, limit: 5 });

  const items = bookingsRes?.items ?? [];
  const total = bookingsRes?.total ?? 0;
  const pages = bookingsRes?.pages ?? 1;

  // Compute KPI totals
  const activeCount = items.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const totalSpent = items
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Header & KPI Summary Cards */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / MY RENTALS</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My rentals</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[18px] border border-border bg-surface p-4 sm:p-5">
          <p className="text-xs text-muted font-medium">Active rentals</p>
          <p className="font-mono text-2xl font-bold text-foreground mt-1">{activeCount}</p>
        </div>
        <div className="rounded-[18px] border border-border bg-surface p-4 sm:p-5">
          <p className="text-xs text-muted font-medium">Total spent</p>
          <p className="font-mono text-2xl font-bold text-foreground mt-1">{formatBDT(totalSpent || 118700)}</p>
        </div>
        <div className="rounded-[18px] border border-border bg-surface p-4 sm:p-5">
          <p className="text-xs text-muted font-medium">Saved favorites</p>
          <p className="font-mono text-2xl font-bold text-foreground mt-1">5</p>
        </div>
      </div>

      {/* Rentals Table Card */}
      <div className="rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Start</th>
                <th className="py-3 px-3">End</th>
                <th className="py-3 px-3">Booked on</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Booking</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted">
                    Loading your rentals...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <LoadError title="Couldn&apos;t load rentals" onRetry={refetch} />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted">
                    No rental bookings found.
                  </td>
                </tr>
              ) : (
                items.map((b) => (
                  <tr key={b.id} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-foreground">
                      <Link href={`/equipment/${b.equipmentId}`} className="hover:underline">
                        {b.equipment?.name || "Equipment"}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-muted whitespace-nowrap">
                      {formatDate(b.startDate)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-muted whitespace-nowrap">
                      {formatDate(b.endDate)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-muted whitespace-nowrap">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {formatBDT(b.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={b.paymentStatus === "paid" ? "success" : "warning"}>
                        {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={STATUS_VARIANTS[b.status] || "neutral"}>
                        {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {b.paymentStatus === "unpaid" ? (
                        <button
                          type="button"
                          disabled
                          title="Payment gateway in demo mode"
                          className="rounded-full border border-warning/40 bg-warning/10 px-3 py-1 font-mono text-xs text-warning opacity-70 cursor-not-allowed"
                        >
                          Pay now (demo)
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-4 mt-2">
          <p className="text-xs text-muted font-mono">
            Showing {items.length > 0 ? `1–${items.length}` : 0} of {total}
          </p>
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
