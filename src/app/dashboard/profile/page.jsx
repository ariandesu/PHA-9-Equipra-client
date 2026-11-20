import { requireRole } from "@/lib/require-role";
import ProfileForm from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const session = await requireRole();
  return <ProfileForm title="Profile" role={session.user.role} />;
}
