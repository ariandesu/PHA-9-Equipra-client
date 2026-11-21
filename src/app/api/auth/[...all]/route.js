import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, resetAuth } from "@/lib/auth";
import { isMongoConnectionError } from "@/lib/auth-cache";

// Built once per BetterAuth instance. Keying by instance means a reset (failed
// connect, closed topology) builds a new handler on the next request instead of
// serving a handler bound to a dead client.
const handlers = new WeakMap();

function handlerFor(auth) {
  let handler = handlers.get(auth);
  if (!handler) {
    handler = toNextJsHandler(auth);
    handlers.set(auth, handler);
  }
  return handler;
}

// A misconfigured deployment (missing secret or URI) must not answer with a
// bodyless 500: that is indistinguishable from a crash and gives no clue what
// to fix. Surface the configuration message and log the details.
function respond(method) {
  return async (request) => {
    try {
      const auth = await getAuth();
      const response = await handlerFor(auth)[method](request);

      // BetterAuth turned a database failure into a 500: drop the cached client
      // so the next request reconnects instead of reusing a closed topology.
      if (response && response.status >= 500) resetAuth();
      return response;
    } catch (error) {
      // Nothing in this block may throw: a throw here would surface as the same
      // bodyless 500 this handler exists to prevent.
      const path = request?.url ?? "<unknown url>";
      console.error(`[auth] ${method} ${path} failed:`, error?.stack ?? error?.message);

      if (isMongoConnectionError(error)) resetAuth();

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
