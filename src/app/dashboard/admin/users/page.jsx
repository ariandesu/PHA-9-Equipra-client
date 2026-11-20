import { requireRole } from "@/lib/require-role";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / ALL USERS</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">All users</h1>
      </div>
      <p className="text-sm text-muted">Admin users management lands in task F-22.</p>
    </div>
  );
}
