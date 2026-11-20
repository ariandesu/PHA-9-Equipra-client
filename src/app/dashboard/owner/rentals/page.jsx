import { requireRole } from "@/lib/require-role";
import OwnerRentalsTable from "@/components/dashboard/owner-rentals-table";

export default async function OwnerRentalsPage() {
  await requireRole(["owner"]);
  return <OwnerRentalsTable />;
}
