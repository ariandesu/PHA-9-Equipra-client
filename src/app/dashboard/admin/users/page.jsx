export const metadata = {
  title: "All users — Equipra",
  description: "Manage user roles and accounts.",
};

import { requireRole } from "@/lib/require-role";
import AdminUsersTable from "@/components/dashboard/admin-users-table";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  return <AdminUsersTable />;
}
