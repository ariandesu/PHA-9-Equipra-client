export const metadata = {
  title: "My rentals — Equipra",
  description: "Your rental bookings, payment status and hold expiry.",
};

import { requireRole } from "@/lib/require-role";
import RentalsTable from "@/components/dashboard/rentals-table";

export default async function MyRentalsPage() {
  await requireRole(["customer"]);
  return <RentalsTable />;
}
