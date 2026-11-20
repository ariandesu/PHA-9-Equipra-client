import { requireRole } from "@/lib/require-role";

export default async function MyRentalsPage() {
  const session = await requireRole(["customer"]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / MY RENTALS</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My rentals</h1>
      </div>
      <p className="text-sm text-muted">Welcome, {session.user.name}. Customer rental history lands in task F-17.</p>
    </div>
  );
}
