import { requireRole } from "@/lib/require-role";
import ProfileForm from "@/components/dashboard/profile-form";

export default async function OwnerProfilePage() {
  await requireRole(["owner"]);
  return <ProfileForm title="My profile" role="owner" />;
}
