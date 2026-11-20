import { requireRole } from "@/lib/require-role";

export default async function AdminOverviewPage() {
  await requireRole(["admin"]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / OVERVIEW</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Platform overview</h1>
      </div>
      <p className="text-sm text-muted">Admin analytics overview lands in task F-21.</p>
    </div>
  );
}
