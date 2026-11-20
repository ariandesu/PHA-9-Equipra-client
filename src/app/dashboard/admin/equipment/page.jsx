export const metadata = {
  title: "All equipment — Equipra",
  description: "Approve, reject or remove listings.",
};

import { requireRole } from "@/lib/require-role";
import AdminEquipmentTable from "@/components/dashboard/admin-equipment-table";

export default async function AdminEquipmentPage() {
  await requireRole(["admin"]);
  return <AdminEquipmentTable />;
}
