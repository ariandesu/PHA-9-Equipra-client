import { requireRole } from "@/lib/require-role";

export default async function OwnerRentalsPage() {
  await requireRole(["owner"]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / EQUIPMENT RENTALS</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Equipment rentals</h1>
      </div>
      <p className="text-sm text-muted">Owner equipment rentals table lands in task F-20.</p>
    </div>
  );
}
