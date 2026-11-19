"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AuthShell from "@/components/auth/auth-shell";
import GoogleButton from "@/components/auth/google-button";
import { AuthError, AuthField, AuthHeading } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validators";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      const message = error.message || "Invalid email or password.";
      setError("root", { message });
      toast.error(message);
      return;
    }

    toast.success("Welcome back!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <AuthShell>
      <div className="space-y-6">
        <AuthHeading
          title="Welcome back"
          subtitle={
            <p className="text-sm text-muted">
              New to Equipra?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </p>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <AuthField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="rafi@mail.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </AuthField>

          <AuthField
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
          >
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
          </AuthField>

          <AuthError message={errors.root?.message} />

          <Button type="submit" variant="action" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Log in"}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-subtle">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton label="Continue with Google" />
      </div>
    </AuthShell>
  );
}
