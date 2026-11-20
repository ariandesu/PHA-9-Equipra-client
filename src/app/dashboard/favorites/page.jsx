export const metadata = {
  title: "Favorites — Equipra",
  description: "Equipment you saved for later.",
};

import { requireRole } from "@/lib/require-role";
import FavoritesTable from "@/components/dashboard/favorites-table";

export default async function FavoritesPage() {
  await requireRole(["customer"]);
  return <FavoritesTable />;
}
