export const metadata = {
  title: "My profile — Equipra",
  description: "Your admin profile.",
};

import { requireRole } from "@/lib/require-role";
import ProfileForm from "@/components/dashboard/profile-form";

export default async function AdminProfilePage() {
  await requireRole(["admin"]);
  return <ProfileForm title="My profile" role="admin" />;
}
