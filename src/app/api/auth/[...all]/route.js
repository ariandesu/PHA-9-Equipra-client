import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

// Resolved per request so the BetterAuth instance — and its database
// connection — is only built when the route is actually hit, not at build time.
let cachedHandler = null;

function handler() {
  if (!cachedHandler) cachedHandler = toNextJsHandler(getAuth());
  return cachedHandler;
}

// A misconfigured deployment (missing secret or URI) must not answer with a
// bodyless 500: that is indistinguishable from a crash and gives no clue what
// to fix. Surface the configuration message and log the details.
function respond(method) {
  return async (request) => {
    try {
      return await handler()[method](request);
    } catch (error) {
      // Nothing in this block may throw: a throw here would surface as the same
      // bodyless 500 this handler exists to prevent.
      const path = request?.url ?? "<unknown url>";
      console.error(`[auth] ${method} ${path} failed:`, error?.stack ?? error?.message);

      const isConfigError = /is not set/.test(error?.message ?? "");

      return Response.json(
        {
          message: isConfigError
            ? "Authentication is not configured on this deployment."
            : "Authentication request failed.",
          code: isConfigError ? "AUTH_MISCONFIGURED" : "AUTH_FAILED",
        },
        { status: 503 },
      );
    }
  };
}

export const GET = respond("GET");
export const POST = respond("POST");
