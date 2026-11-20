import { requireRole } from "@/lib/require-role";
import RentalsTable from "@/components/dashboard/rentals-table";

export default async function MyRentalsPage() {
  await requireRole(["customer"]);
  return <RentalsTable />;
}
