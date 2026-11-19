import { PASSWORD_RULE_MESSAGE } from "@/lib/auth-rules";

function Rule({ ok, children }) {
  return (
    <li className={ok ? "text-success" : "text-subtle"}>
      <span aria-hidden="true">{ok ? "✓" : "○"}</span> {children}
    </li>
  );
}

export default function PasswordRules({ value = "" }) {
  return (
    <ul
      id="password-rules"
      className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs"
      aria-label="Password requirements"
    >
      <Rule ok={/[A-Z]/.test(value)}>Uppercase</Rule>
      <Rule ok={/[a-z]/.test(value)}>Lowercase</Rule>
      <Rule ok={value.length >= 6}>6+ characters</Rule>
    </ul>
  );
}

export function PasswordRuleHint() {
  return <span className="sr-only">{PASSWORD_RULE_MESSAGE}</span>;
}
