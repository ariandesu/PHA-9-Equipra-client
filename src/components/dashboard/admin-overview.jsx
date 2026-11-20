"use client";

import { useReducedMotion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import GlowCard from "@/components/fx/glow-card";
import { useAdminAnalytics } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  borderColor: "var(--border)",
  borderRadius: "10px",
  fontSize: "12px",
};

function monthLabel(value) {
  const parts = String(value || "").split("-");
  const index = parseInt(parts[1], 10) - 1;
  return MONTH_NAMES[index] || value;
}

export default function AdminOverview() {
  const reduced = useReducedMotion();
  const { data: analyticsRes, isPending } = useAdminAnalytics();
  const data = analyticsRes?.data ?? {};

  const monthly = (data.monthly ?? []).map((row) => ({
    month: monthLabel(row.month),
    bookings: row.bookings ?? 0,
    revenue: Math.round((row.revenue ?? 0) / 100000), // lakh, matching screen 05
  }));

  const kpis = [
    { label: "Total users", value: (data.totalUsers ?? 0).toLocaleString("en-IN"), delta: "+84", deltaTone: "text-success" },
    { label: "Total equipment", value: (data.totalEquipment ?? 0).toLocaleString("en-IN"), delta: "+41", deltaTone: "text-success" },
    { label: "Total bookings", value: (data.totalBookings ?? 0).toLocaleString("en-IN"), delta: "+112", deltaTone: "text-success" },
    { label: "Pending approvals", value: (data.pendingApprovals ?? 0).toLocaleString("en-IN"), delta: "Review", deltaTone: "text-warning" },
    { label: "Completed rentals", value: (data.completedRentals ?? 0).toLocaleString("en-IN"), delta: "97%", deltaTone: "text-info" },
    { label: "Total revenue", value: formatBDT(data.totalRevenue ?? 0), delta: "+27%", deltaTone: "text-success", accent: true },
  ];

  return (
    <div className="flex flex-col gap-8 w-full text-left pb-12">
      <div className="flex flex-col gap-1 border-b border-border pb-5">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / OVERVIEW</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
          Platform overview
        </h1>
      </div>

      {/* 6 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {kpis.map((kpi) => (
          <GlowCard
            key={kpi.label}
            className={
              kpi.accent
                ? "p-5 flex flex-col justify-between bg-gradient-to-br from-surface to-accent/10 border-accent/30"
                : "p-5 flex flex-col justify-between"
            }
          >
            <div className="flex items-start justify-between gap-2">
              <p className={`text-xs font-medium ${kpi.accent ? "text-accent" : "text-muted"}`}>{kpi.label}</p>
              <span className={`font-mono text-[11px] font-semibold ${kpi.deltaTone}`}>{kpi.delta}</span>
            </div>
            <p className={`font-mono text-2xl sm:text-3xl font-bold mt-3 ${kpi.accent ? "text-accent" : "text-foreground"}`}>
              {kpi.value}
            </p>
          </GlowCard>
        ))}
      </div>

      {/* Charts: monthly bookings bars + revenue area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Monthly bookings</h2>
              <p className="text-xs text-muted">Last 6 months</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            {isPending ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-raised" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [value, "Bookings"]} />
                  <Bar dataKey="bookings" radius={[6, 6, 0, 0]} isAnimationActive={!reduced}>
                    {monthly.map((row, index) => (
                      <Cell
                        key={`bar-${row.month}`}
                        fill={index === monthly.length - 1 ? "var(--accent)" : "var(--border)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col rounded-[22px] border border-border bg-surface p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Revenue (৳ lakh)</h2>
              <p className="text-xs text-muted">Paid bookings only</p>
            </div>
            <span className="font-mono text-[11px] font-semibold text-success">+27% MoM</span>
          </div>

          <div className="h-64 w-full pt-2">
            {isPending ? (
              <div className="h-full w-full animate-pulse rounded-xl bg-raised" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`৳${value} L`, "Revenue"]} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    fill="url(#revenueFill)"
                    isAnimationActive={!reduced}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
