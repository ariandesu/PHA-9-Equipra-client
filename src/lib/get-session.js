import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export const getServerSession = cache(async () => {
  const auth = await getAuth();
  return auth.api.getSession({ headers: await headers() });
});
