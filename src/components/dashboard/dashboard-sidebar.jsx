"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ArrowLeft,
  Search,
  LayoutDashboard,
  PlusCircle,
  Package,
  CalendarCheck,
  User,
  Heart,
  Users,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/layout/logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsOf } from "@/components/layout/user-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_BY_ROLE = {
  customer: [
    { href: "/equipment", label: "Browse equipment", icon: Search },
    { href: "/dashboard/rentals", label: "My rentals", icon: CalendarCheck },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ],
  owner: [
    { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/owner/add", label: "Add equipment", icon: PlusCircle },
    { href: "/dashboard/owner/equipment", label: "My equipment", icon: Package },
    { href: "/dashboard/owner/rentals", label: "Equipment rentals", icon: CalendarCheck },
    { href: "/dashboard/owner/profile", label: "My profile", icon: User },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "All users", icon: Users },
    { href: "/dashboard/admin/equipment", label: "All equipment", icon: CheckCircle2 },
    { href: "/dashboard/admin/rentals", label: "All rentals", icon: CalendarCheck },
    { href: "/dashboard/admin/profile", label: "My profile", icon: User },
  ],
};

function SidebarLinks({ items, pathname, onSelect }) {
  return (
    <ul className="flex flex-col gap-1.5 w-full">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onSelect}
              className={cn(
                "relative flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all hover:translate-x-1",
                isActive
                  ? "bg-[#1F1F1F] text-foreground font-semibold"
                  : "text-muted hover:bg-[#1A1A1A] hover:text-foreground",
              )}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-r bg-primary"
                />
              )}
              <Icon className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const role = user?.role || "customer";
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.customer;
  const backLink = { href: "/", label: "Back to site" };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between border-b border-border bg-[#111111] px-4 py-3 w-full fixed top-0 left-0 z-40">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo />
          <span>Equipra</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" className="uppercase font-mono text-[10px]">
            {role}
          </Badge>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open dashboard menu"
                className="flex size-9 items-center justify-center rounded-[10px] border border-border bg-raised text-foreground"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#111111] border-border text-foreground w-64 p-4">
              <SheetTitle className="px-3 pt-4 text-left font-mono text-xs text-muted uppercase">
                {role} Dashboard
              </SheetTitle>
              <div className="mt-6 flex flex-col justify-between h-[calc(100vh-100px)]">
                <SidebarLinks items={navItems} pathname={pathname} onSelect={() => setOpen(false)} />
                <div className="border-t border-border pt-4">
                  <Link
                    href={backLink.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-xs text-muted hover:bg-[#1A1A1A] hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>{backLink.label}</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Sidebar (240px wide per 03 §5) */}
      <aside className="hidden lg:flex flex-col justify-between w-60 shrink-0 bg-[#111111] p-5 border-r border-border min-h-screen text-left">
        <div>
          {/* Logo & Role Badge */}
          <div className="flex items-center justify-between gap-2 pb-6 border-b border-border/80">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span className="font-bold text-base">Equipra</span>
            </Link>
            <Badge variant="neutral" className="uppercase font-mono text-[10px] tracking-wider">
              {role}
            </Badge>
          </div>

          {/* Navigation Links */}
          <div className="pt-6">
            <SidebarLinks items={navItems} pathname={pathname} />
          </div>
        </div>

        {/* Footer: Back link & User card */}
        <div className="flex flex-col gap-4 border-t border-border/80 pt-4">
          <Link
            href={backLink.href}
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>{backLink.label}</span>
          </Link>

          <div className="flex items-center gap-2.5 rounded-[12px] bg-[#161616] border border-border/60 p-2.5">
            <Avatar className="size-9 border border-border">
              {user.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback className="bg-primary text-primary-foreground font-mono text-xs font-bold">
                {initialsOf(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-muted">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
