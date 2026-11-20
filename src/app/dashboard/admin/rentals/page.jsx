import { requireRole } from "@/lib/require-role";
import AdminRentalsTable from "@/components/dashboard/admin-rentals-table";

export default async function AdminRentalsPage() {
  await requireRole(["admin"]);
  return <AdminRentalsTable />;
}
