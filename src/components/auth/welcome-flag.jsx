"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// OAuth callbacks land with ?welcome=1. Toast once, then strip the flag so a
// refresh or back-navigation does not re-announce it. Renders nothing.
export default function WelcomeFlag() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const welcomed = searchParams.get("welcome");

  useEffect(() => {
    if (!welcomed) return;

    toast.success("Welcome!");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("welcome");
    const query = params.toString();

    router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
  }, [welcomed, searchParams, router]);

  return null;
}
