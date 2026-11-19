"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: the client always talks to its own origin (/api/auth/*), which is
// why BETTER_AUTH_URL is server-side only in 02-ARCHITECTURE §2.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
