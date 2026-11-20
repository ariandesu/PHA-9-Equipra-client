export const metadata = {
  title: "Dashboard — Equipra",
  description: "Your Equipra dashboard.",
};

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/require-role";

export default async function DashboardRootPage() {
  const session = await requireRole();

  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  if (session.user.role === "owner") {
    redirect("/dashboard/owner");
  }

  redirect("/dashboard/rentals");
}
