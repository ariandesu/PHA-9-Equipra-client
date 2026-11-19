"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Logo from "@/components/layout/logo";
import ThemeToggle from "@/components/layout/theme-toggle";
import {
  UserMenu,
  initialsOf,
  UserSkeleton,
  LogoutButton,
} from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function AuthActions({ session, className = "" }) {
  // One component decides the whole state so exactly one control renders:
  // skeleton while pending, the avatar menu when signed in, links otherwise.
  if (session.isPending) {
    return (
      <div className={className}>
        <UserSkeleton />
      </div>
    );
  }

  if (session.data?.user) {
    return (
      <div className={className}>
        <UserMenu session={session} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Log in</Link>
      </Button>
      <Button asChild variant="action" size="sm">
        <Link href="/register">Get started</Link>
      </Button>
    </div>
  );
}

export default function Navbar() {
  const reduced = useReducedMotion();
  const session = authClient.useSession();
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(false);

  const user = session.data?.user;

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-[1100px] px-4">
      <nav
        className="flex items-center justify-between gap-4 rounded-full border border-border bg-background/70 px-4 py-2 backdrop-blur"
        aria-label="Main"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span>Equipra</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href} className="relative">
              <Link
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(link.href)}
                onBlur={() => setHovered(null)}
                className="relative rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/15"
              >
                {hovered === link.href && !reduced && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-raised"
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthActions session={session} className="hidden sm:flex" />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>Menu</SheetTitle>
              <ul className="mt-6 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-[10px] px-3 py-2 text-sm text-muted hover:bg-raised hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {user ? (
                  <li className="border-t border-border pt-4">
                    <div className="mb-2 flex items-center gap-2 px-3">
                      <Avatar className="size-9">
                        {user.image && <AvatarImage src={user.image} alt="" />}
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {initialsOf(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block rounded-[10px] px-3 py-2 text-sm text-muted hover:bg-raised hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                    <LogoutButton onDone={() => setOpen(false)} />
                  </li>
                ) : (
                  <li className="flex gap-2 pt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild variant="action" size="sm">
                      <Link href="/register" onClick={() => setOpen(false)}>
                        Get started
                      </Link>
                    </Button>
                  </li>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
