"use client";

import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";
import WelcomeFlag from "@/components/auth/welcome-flag";
import CommandMenu from "@/components/layout/command-menu";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        {children}
        <CommandMenu />
        <Suspense fallback={null}>
          <WelcomeFlag />
        </Suspense>
        <Toaster theme="dark" position="top-center" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
