// Accepts only same-origin absolute paths. Anything with a scheme, a
// protocol-relative prefix ("//"), or a backslash escape ("/\") is a
// cross-origin redirect in disguise and falls back.
export function safeRedirect(value, fallback = "/dashboard") {
  if (typeof value !== "string" || value.length === 0) return fallback;

  // Control characters and whitespace let " //evil.com" or "/\t/evil.com"
  // slip past a naive prefix check, and browsers strip them.
  if (/[\u0000-\u001F\u007F\s]/.test(value)) return fallback;

  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;

  // A scheme in the first path segment: "/javascript:alert(1)". Only the path
  // is inspected — a colon in the query or hash ("/x?t=1:2") is harmless.
  const path = value.split(/[?#]/)[0];
  const firstSegment = path.slice(1).split("/")[0];
  if (firstSegment.includes(":")) return fallback;

  return value;
}
