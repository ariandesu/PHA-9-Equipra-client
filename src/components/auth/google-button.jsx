"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function withWelcome(path) {
  return path.includes("?") ? `${path}&welcome=1` : `${path}?welcome=1`;
}

export default function GoogleButton({
  label = "Continue with Google",
  redirectTo = "/dashboard",
}) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);

    try {
      // signIn.social resolves with { error } rather than throwing, so the
      // result has to be inspected or failures vanish silently.
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: withWelcome(redirectTo),
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed. Please try again.");
        setPending(false);
      }
    } catch {
      toast.error("Could not reach Google. Please try again.");
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={pending}
      className="w-full"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.6Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.3 14.2a7.2 7.2 0 0 1 0-4.5V6.6H1.3a12 12 0 0 0 0 10.8l4-3.2Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z"
        />
      </svg>
      {pending ? "Opening Google..." : label}
    </Button>
  );
}
