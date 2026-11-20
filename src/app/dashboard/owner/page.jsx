export const metadata = {
  title: "Owner overview — Equipra",
  description: "Owner analytics for your equipment.",
};

import { requireRole } from "@/lib/require-role";
import OwnerOverview from "@/components/dashboard/owner-overview";

export default async function OwnerDashboardPage() {
  const session = await requireRole(["owner"]);
  return <OwnerOverview userName={session.user.name || "Karim"} />;
}
