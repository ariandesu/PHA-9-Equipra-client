"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AuthShell from "@/components/auth/auth-shell";
import GoogleButton from "@/components/auth/google-button";
import PhotoField from "@/components/auth/photo-field";
import PasswordRules, { PasswordRuleHint } from "@/components/auth/password-rules";
import { AuthError, AuthField, AuthHeading } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validators";
import { authClient } from "@/lib/auth-client";

const roleOptions = [
  { value: "renter", label: "Rent equipment", hint: "I want to rent gear." },
  { value: "owner", label: "List my equipment", hint: "I want to earn from my gear." },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      accountType: "renter",
      password: "",
    },
  });

  const password = useWatch({ control, name: "password" });
  const photoURL = useWatch({ control, name: "photoURL" });
  const accountType = useWatch({ control, name: "accountType" });

  async function onSubmit(values) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.photoURL || undefined,
      accountType: values.accountType,
    });

    if (error) {
      const message = error.message || "Could not create your account.";
      setError("root", { message });
      toast.error(message);
      return;
    }

    toast.success(`Welcome aboard, ${values.name.split(" ")[0]}! Account created.`);
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <AuthShell>
      <div className="space-y-6">
        <AuthHeading
          title="Create your account"
          subtitle={
            <p className="text-sm text-muted">
              Already renting with us?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField label="Full name" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Rafi Chowdhury"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </AuthField>
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
          </div>

          <PhotoField
            id="photoURL"
            value={photoURL}
            onChange={(next) => setValue("photoURL", next, { shouldValidate: true })}
            error={errors.photoURL?.message}
          />

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-foreground">
              I want to
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-2 rounded-[10px] border px-3 py-3 text-sm transition-colors ${
                    accountType === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border-strong bg-raised"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="mt-0.5 accent-primary"
                    {...register("accountType")}
                  />
                  <span>
                    <span className="block font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="block text-xs text-muted">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <AuthField label="Password" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-rules"
              {...register("password")}
            />
            <PasswordRules value={password || ""} />
            <PasswordRuleHint />
          </AuthField>

          <AuthError message={errors.root?.message} />

          <Button type="submit" variant="action" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-subtle">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton />

        <p className="text-xs text-subtle">
          Google sign-ups start as Customers. Owners can switch role from their
          profile.
        </p>
      </div>
    </AuthShell>
  );
}
