"use client";

import { useState } from "react";
import Link from "next/link";
import { formatBDT, formatDate } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/catalog/pagination";
import { useOwnerBookings } from "@/lib/data/hooks";

const STATUS_VARIANTS = {
  confirmed: "info",
  completed: "neutral",
  pending: "warning",
  cancelled: "danger",
};

export default function OwnerRentalsTable() {
  const [page, setPage] = useState(1);
  const { data: bookingsRes, isPending } = useOwnerBookings({ page, limit: 10 });

  const items = bookingsRes?.items ?? (Array.isArray(bookingsRes) ? bookingsRes : []);
  const total = bookingsRes?.total ?? items.length;
  const pages = bookingsRes?.pages ?? 1;

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / EQUIPMENT RENTALS</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Equipment rentals</h1>
          <span className="rounded-full border border-border bg-raised px-2.5 py-0.5 font-mono text-xs text-muted">
            {total} BOOKINGS
          </span>
        </div>
      </div>

      {/* Rentals Table Card */}
      <div className="rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Equipment</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Qty</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    Loading equipment rentals...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <p className="text-sm font-medium text-foreground">No rentals yet</p>
                    <p className="mt-1 text-xs">Customer bookings for your equipment will appear here.</p>
                  </td>
                </tr>
              ) : (
                items.map((b) => (
                  <tr key={b.id} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div>
                        <p className="font-medium text-foreground">{b.customer?.name || "Customer"}</p>
                        <p className="text-xs text-muted">{b.customer?.email || "customer@mail.com"}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-foreground">
                      <Link href={`/equipment/${b.equipmentId}`} className="hover:underline">
                        {b.equipment?.name || "Equipment"}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-muted whitespace-nowrap">
                      {formatDate(b.startDate)} – {formatDate(b.endDate)}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-foreground">{b.quantity}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {formatBDT(b.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <Badge variant={b.paymentStatus === "paid" ? "success" : "warning"}>
                        {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <Badge variant={STATUS_VARIANTS[b.status] || "neutral"}>
                        {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Pending"}
                      </Badge>
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
