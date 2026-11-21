"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import GlowCard from "@/components/fx/glow-card";
import { Button } from "@/components/ui/button";
import { useOwnerAnalytics } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const DONUT_COLORS = {
  completed: "#4ADE80", // success green
  confirmed: "#38BDF8", // sky blue
  pending: "#FACC15",   // warning yellow
};

export default function OwnerOverview({ userName = "Karim" }) {
  const { data: analyticsRes, isPending } = useOwnerAnalytics();
  const data = analyticsRes?.data ?? {};

  const monthlyData = (data.monthly ?? []).map((m) => {
    const monthNum = parseInt(m.month.split("-")[1], 10) - 1;
    return {
      month: MONTH_NAMES[monthNum] || m.month,
      earnings: Math.round((m.earnings ?? 0) / 1000), // in thousands
    };
  });

  const statusMix = data.statusMix ?? [];
  const latestEarnings = data.monthly?.[data.monthly.length - 1]?.earnings ?? 0;

  return (
    <div className="flex flex-col gap-8 w-full text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / OVERVIEW</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            Good evening, {userName}
          </h1>
        </div>
        <Button variant="action" asChild className="self-start sm:self-auto">
          <Link href="/dashboard/owner/add" className="flex items-center gap-1.5">
            <PlusCircle className="size-4" />
            <span>Add equipment</span>
          </Link>
        </Button>
      </div>

      {/* 4 KPI GlowCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <GlowCard className="p-5 flex flex-col justify-between">
          <p className="text-xs text-muted font-medium">Listed equipment</p>
          <p className="font-mono text-3xl font-bold text-foreground mt-2">{data.listed ?? 0}</p>
          <p className="text-[11px] text-muted mt-2 font-mono">
            {data.approved ?? 0} approved · {data.pending ?? 0} pending · {data.rejected ?? 0} rejected
          </p>
        </GlowCard>

        <GlowCard className="p-5 flex flex-col justify-between">
          <p className="text-xs text-muted font-medium">Completed rentals</p>
          <p className="font-mono text-3xl font-bold text-foreground mt-2">{data.completedRentals ?? 0}</p>
          <p className="text-[11px] text-muted mt-2">Completed bookings</p>
        </GlowCard>

        <GlowCard className="p-5 flex flex-col justify-between">
          <p className="text-xs text-muted font-medium">Total earnings</p>
          <p className="font-mono text-3xl font-bold text-foreground mt-2">{formatBDT(data.totalEarnings ?? 0)}</p>
          <p className="text-[11px] text-muted mt-2">All-time, paid bookings</p>
        </GlowCard>

        {/* 4th card with orange gradient accent per 03 §5 */}
        <GlowCard className="p-5 flex flex-col justify-between bg-gradient-to-br from-surface to-accent/10 border-accent/30">
          <p className="text-xs text-accent font-medium">This month</p>
          <p className="font-mono text-3xl font-bold text-accent mt-2">{formatBDT(data.thisMonth ?? 0)}</p>
          <p className="text-[11px] text-accent mt-2 font-medium">Paid bookings</p>
        </GlowCard>
      </div>

      {/* Charts Row: Monthly Earnings Bars + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Monthly Earnings Bar Chart (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Monthly earnings (৳ thousand)</h2>
              <p className="text-xs text-muted">Last 6 months</p>
            </div>
            <span className="font-mono text-xs text-accent font-medium">Latest: {formatBDT(latestEarnings)}</span>
          </div>

          <div className="h-64 w-full pt-2">
            {isPending ? (
              <div className="h-full w-full animate-pulse bg-raised rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderRadius: "10px", fontSize: "12px" }}
                    formatter={(val) => [`৳${val}k`, "Earnings"]}
                  />
                  <Bar dataKey="earnings" radius={[6, 6, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === monthlyData.length - 1 ? "var(--chart-2)" : "#262626"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Mix Donut (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-foreground">Rental status mix</h2>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative my-2">
            {isPending ? (
              <div className="size-36 rounded-full animate-pulse bg-raised" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderRadius: "10px", fontSize: "12px" }}
                    formatter={(val) => [`${val}%`, "Percent"]}
                  />
                  <Pie
                    data={statusMix}
                    dataKey="percent"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {statusMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[entry.status] || "var(--accent)"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {statusMix.map((item) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: DONUT_COLORS[item.status] || "var(--accent)" }}
                  />
                  <span className="capitalize text-foreground font-medium">{item.status === "pending" ? "Pending payment" : item.status}</span>
                </div>
                <span className="font-mono text-muted">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
