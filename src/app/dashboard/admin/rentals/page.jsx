export const metadata = {
  title: "All rentals — Equipra",
  description: "Every booking on the platform.",
};

import { requireRole } from "@/lib/require-role";
import AdminRentalsTable from "@/components/dashboard/admin-rentals-table";

export default async function AdminRentalsPage() {
  await requireRole(["admin"]);
  return <AdminRentalsTable />;
}
