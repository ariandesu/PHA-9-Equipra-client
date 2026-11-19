import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

// Resolved per request so the BetterAuth instance — and its database
// connection — is only built when the route is actually hit, not at build time.
let cachedHandler = null;

function handler() {
  if (!cachedHandler) cachedHandler = toNextJsHandler(getAuth());
  return cachedHandler;
}

export function GET(request) {
  return handler().GET(request);
}

export function POST(request) {
  return handler().POST(request);
}
