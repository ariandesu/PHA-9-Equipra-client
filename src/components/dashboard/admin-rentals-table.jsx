"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import LoadError from "@/components/dashboard/load-error";
import { formatBDT, formatDate } from "@/lib/money";
import { useAdminBookings, useUpdateBookingStatus } from "@/lib/data/hooks";

const STATUS_FILTERS = [
  { id: "", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUS_UPDATES = ["confirmed", "completed", "cancelled"];

const STATUS_VARIANTS = {
  confirmed: "info",
  completed: "neutral",
  pending: "warning",
  cancelled: "danger",
};

export default function AdminRentalsTable() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: bookingsRes, isPending, isError, refetch } = useAdminBookings({
    status: status || undefined,
    page,
    limit: 10,
  });
  const updateStatus = useUpdateBookingStatus();

  const items = bookingsRes?.items ?? [];
  const total = bookingsRes?.total ?? 0;
  const pages = Math.max(1, bookingsRes?.pages ?? Math.ceil(total / 10));

  async function handleStatusChange(booking, nextStatus) {
    if (nextStatus === booking.status) return;
    try {
      await updateStatus.mutateAsync({ id: booking.id, status: nextStatus });
      toast.success(`Booking set to ${nextStatus}`);
    } catch (err) {
      toast.error(err.message || "Could not update the booking");
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / ALL RENTALS</p>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">All rentals</h1>
            <span className="rounded-full border border-border bg-raised px-2.5 py-0.5 font-mono text-xs text-muted">
              {total} BOOKINGS
            </span>
          </div>
        </div>

        <div role="tablist" aria-label="Booking status" className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab.id || "all"}
              type="button"
              role="tab"
              aria-selected={status === tab.id}
              onClick={() => {
                setStatus(tab.id);
                setPage(1);
              }}
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
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">Loading rentals…</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <LoadError title="Couldn&apos;t load rentals" onRetry={refetch} />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    No bookings in this status.
                  </td>
                </tr>
              ) : (
                items.map((booking) => (
                  <tr key={booking.id} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-medium text-foreground">{booking.customer?.name || "—"}</p>
                      <p className="text-xs text-muted">{booking.customer?.email || ""}</p>
                    </td>
                    <td className="py-3.5 px-3 text-muted whitespace-nowrap">{booking.owner?.name || "—"}</td>
                    <td className="py-3.5 px-3 font-medium text-foreground line-clamp-1">
                      {booking.equipment?.name || "—"}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-muted whitespace-nowrap">
                      {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {formatBDT(booking.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={booking.paymentStatus === "paid" ? "success" : "warning"}>
                        {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_VARIANTS[booking.status] || "neutral"}>
                          {booking.status}
                        </Badge>
                        <label className="sr-only" htmlFor={`status-${booking.id}`}>
                          Booking status for {booking.equipment?.name}
                        </label>
                        <select
                          id={`status-${booking.id}`}
                          value={booking.status}
                          onChange={(event) => handleStatusChange(booking, event.target.value)}
                          className="rounded-[8px] border border-border bg-raised px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {STATUS_UPDATES.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4 mt-2 text-xs text-muted">
            <span>
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-[8px] border border-border px-3 py-1 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-[8px] border border-border px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
