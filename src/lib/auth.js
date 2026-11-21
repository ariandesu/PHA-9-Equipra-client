import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError } from "better-auth/api";
import {
  PASSWORD_RULE_MESSAGE,
  resolveRole,
  validatePassword,
} from "@/lib/auth-rules";
import { createAuthCache } from "@/lib/auth-cache";

// Built lazily on first request. Eager construction at module scope made the
// production build fail whenever MONGODB_URI was absent, which would also break
// every preview deployment. Build time must not depend on runtime secrets.
const cache = createAuthCache(async () => createAuth());

function createAuth() {
  const uri = process.env.MONGODB_URI;
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!uri) {
    throw new Error("MONGODB_URI is not set — copy .env.example to .env.local");
  }

  // Without this BetterAuth falls back to a default secret and throws at request
  // time, which surfaced to callers as a bare, unexplained 500.
  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET is not set — copy .env.example to .env.local",
    );
  }

  // A failed auto-connect closes the topology for good, so the connect is done
  // explicitly in getAuth() and these limits keep that failure fast (8s) instead
  // of the default 30s server-selection timeout.
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    maxIdleTimeMS: 60000,
  });
  const db = client.db(process.env.DB_NAME || "equipra");
  const baseURL = process.env.BETTER_AUTH_URL;

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    baseURL,
    secret,
    // Filtered so an unset BETTER_AUTH_URL does not become a trusted [undefined].
    trustedOrigins: [baseURL].filter(Boolean),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      // Spec (01-PRODUCT-SPEC): >= 6 chars. BetterAuth defaults to 8 and would
      // reject valid 6-7 char passwords before our rule ever runs.
      minPasswordLength: 6,
    },
    // Only registered when both halves are present, so a half-configured Google
    // provider fails the request cleanly instead of emitting a startup warning
    // and then erroring mid-OAuth.
    ...(googleClientId && googleClientSecret
      ? {
          socialProviders: {
            google: { clientId: googleClientId, clientSecret: googleClientSecret },
          },
        }
      : {}),
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "customer", input: false },
        phone: { type: "string", input: false },
        address: { type: "string", input: false },
      },
    },
    databaseHooks: {
      user: {
        create: {
          // Signup may only ever produce customer or owner. Anything else,
          // including every Google signup, falls back to customer — so `admin`
          // can never be self-assigned.
          before: async (user, ctx) => {
            const password = ctx?.body?.password;

            if (typeof password === "string" && !validatePassword(password)) {
              throw new APIError("BAD_REQUEST", {
                message: PASSWORD_RULE_MESSAGE,
              });
            }

            return {
              data: { ...user, role: resolveRole(ctx?.body?.accountType) },
            };
          },
        },
      },
    },
  });

  return { auth, client };
}

// Async and promise-memoised: the client is connected before any request work,
// and a failed connect clears the cache so the next request builds a fresh one.
export function getAuth() {
  return cache.get();
}

export function resetAuth() {
  cache.reset();
}
