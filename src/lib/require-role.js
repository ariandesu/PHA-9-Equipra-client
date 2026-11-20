// Server-only helper — do not import in client components
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export async function requireRole(allowedRoles = []) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }

  return session;
}
