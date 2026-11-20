import { requireRole } from "@/lib/require-role";

export default async function FavoritesPage() {
  const session = await requireRole(["customer"]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / FAVORITES</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Favorites</h1>
      </div>
      <p className="text-sm text-muted">Welcome, {session.user.name}. Saved equipment lands in task F-17.</p>
    </div>
  );
}
