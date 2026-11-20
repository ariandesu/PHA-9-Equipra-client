import { requireRole } from "@/lib/require-role";

export default async function OwnerOverviewPage() {
  const session = await requireRole(["owner"]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / OVERVIEW</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Good evening, {session.user.name}</h1>
      </div>
      <p className="text-sm text-muted">Owner analytics overview lands in task F-18.</p>
    </div>
  );
}
