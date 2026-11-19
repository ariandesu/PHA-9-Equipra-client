export const PASSWORD_RULE_MESSAGE =
  "Needs an uppercase letter, a lowercase letter and at least 6 characters";

// Exact match only. A lookup table would resolve inherited keys such as
// "constructor" through Object.prototype and leak a non-string role.
export function resolveRole(accountType) {
  return accountType === "owner" ? "owner" : "customer";
}

// ASCII character classes on purpose: the client form and the BetterAuth hook
// must apply byte-identical rules, so neither uses Unicode case mapping.
export function validatePassword(password) {
  if (typeof password !== "string") return false;
  return password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);
}
