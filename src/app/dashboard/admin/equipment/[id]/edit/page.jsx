import { requireRole } from "@/lib/require-role";
import OwnerEditEquipmentForm from "@/components/dashboard/owner-edit-equipment-form";

export const metadata = {
  title: "Edit equipment — Equipra",
  description: "Update an equipment listing as an administrator.",
};

export default async function AdminEditEquipmentPage({ params }) {
  await requireRole(["admin"]);
  const { id } = await params;
  return (
    <OwnerEditEquipmentForm
      equipmentId={id}
      returnTo="/dashboard/admin/equipment"
    />
  );
}
