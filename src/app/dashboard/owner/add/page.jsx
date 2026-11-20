import { requireRole } from "@/lib/require-role";
import EquipmentForm from "@/components/dashboard/equipment-form";

export default async function OwnerAddEquipmentPage() {
  await requireRole(["owner"]);
  return <EquipmentForm isEdit={false} />;
}
