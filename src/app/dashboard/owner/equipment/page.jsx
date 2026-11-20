import { requireRole } from "@/lib/require-role";
import OwnerEquipmentTable from "@/components/dashboard/owner-equipment-table";

export default async function OwnerMyEquipmentPage() {
  await requireRole(["owner"]);
  return <OwnerEquipmentTable />;
}
