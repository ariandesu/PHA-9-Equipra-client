"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function initialsOf(name = "", email = "") {
  const source = name.trim() || email.split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function UserSkeleton() {
  // Same footprint as the avatar button so the navbar does not shift once the
  // session resolves.
  return (
    <span
      className="block size-11 animate-pulse rounded-full bg-raised"
      aria-hidden="true"
    />
  );
}

export function performLogout() {
  return authClient.signOut().then(({ error }) => {
    if (error) {
      toast.error(error.message || "Could not sign out.");
      return false;
    }

    toast.success("Signed out.");
    return true;
  }, (error) => {
    toast.error(error.message || "Could not sign out.");
    return false;
  });
}

export function LogoutButton({ onDone, className = "" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    const ok = await performLogout();
    setPending(false);
    if (!ok) return;

    router.push("/");
    router.refresh();
    onDone?.();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={`flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-danger hover:bg-danger/10 disabled:opacity-50 ${className}`}
    >
      <LogOut aria-hidden="true" />
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}

export function UserDropdown({ user }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    const ok = await performLogout();
    setPending(false);
    if (!ok) return;

    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={`Account menu for ${user.name || user.email}`}
        >
          <Avatar className="size-9">
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initialsOf(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="block truncate text-xs text-muted">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard aria-hidden="true" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          onSelect={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <LogOut aria-hidden="true" />
          {pending ? "Signing out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenu({ session }) {
  if (session.isPending) return <UserSkeleton />;

  if (session.data?.user) return <UserDropdown user={session.data.user} />;

  return null;
}
