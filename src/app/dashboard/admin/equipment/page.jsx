import { requireRole } from "@/lib/require-role";

export default async function AdminEquipmentPage() {
  await requireRole(["admin"]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / ALL EQUIPMENT</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">All equipment</h1>
      </div>
      <p className="text-sm text-muted">Admin equipment management lands in task F-22.</p>
    </div>
  );
}
