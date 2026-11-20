import { requireRole } from "@/lib/require-role";

export default async function ProfilePage() {
  const session = await requireRole();

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">DASHBOARD / PROFILE</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Profile</h1>
      </div>
      <p className="text-sm text-muted">Signed in as {session.user.name} ({session.user.role}). Profile management lands in task F-17.</p>
    </div>
  );
}
