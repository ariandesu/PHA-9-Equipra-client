// Server-only helper — do not import in client components
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";

export async function requireRole(allowedRoles = []) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }

  return session;
}
