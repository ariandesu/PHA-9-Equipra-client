import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { getAuth, resetAuth } from "@/lib/auth";
import { isMongoConnectionError } from "@/lib/auth-cache";

export const getServerSession = cache(async () => {
  try {
    const auth = await getAuth();
    return await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    // A closed/failed topology must not be reused: drop it, then rethrow so the
    // caller still fails visibly instead of silently looking signed out.
    if (isMongoConnectionError(error)) resetAuth();
    throw error;
  }
});
