import { requireRole } from "@/lib/require-role";
import AdminOverview from "@/components/dashboard/admin-overview";

export default async function AdminOverviewPage() {
  await requireRole(["admin"]);
  return <AdminOverview />;
}
