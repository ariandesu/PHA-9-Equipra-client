export const metadata = {
  title: "Edit equipment — Equipra",
  description: "Update your equipment listing.",
};

import { requireRole } from "@/lib/require-role";
import OwnerEditEquipmentForm from "@/components/dashboard/owner-edit-equipment-form";

// Audit X1: the guard runs on the server; the form itself stays a client
// component because it needs react-hook-form, imgbb upload and TanStack Query.
export default async function OwnerEditEquipmentPage({ params }) {
  await requireRole(["owner"]);
  const { id } = await params;
  return <OwnerEditEquipmentForm equipmentId={id} />;
}
