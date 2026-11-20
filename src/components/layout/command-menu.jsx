"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Package, Home, LayoutDashboard, ShoppingBag } from "lucide-react";

const PAGES = [
  { label: "Home", href: "/", icon: Home },
  { label: "All equipment", href: "/equipment", icon: Package },
  { label: "How it works", href: "/#how-it-works", icon: Search },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Favorites", href: "/dashboard/favorites", icon: ShoppingBag },
];

export default function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // ⌘K / Ctrl+K toggles the palette; Esc closes it.
  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function run(href) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const trimmed = query.trim().slice(0, 60);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default"
      />

      <Command
        label="Command search"
        shouldFilter
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[18px] border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search equipment or jump to a page…"
            aria-label="Search equipment or pages"
            className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted focus-visible:outline-none"
          />
          <kbd className="hidden sm:inline rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
            No matches.
          </Command.Empty>

          {trimmed && (
            <Command.Group heading="Search equipment" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted">
              <Command.Item
                value={`equipment search ${trimmed}`}
                onSelect={() => run(`/equipment?search=${encodeURIComponent(trimmed)}`)}
                className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm text-foreground aria-selected:bg-raised"
              >
                <Package className="size-4 text-primary" aria-hidden="true" />
                <span>
                  Search equipment for <span className="font-semibold">“{trimmed}”</span>
                </span>
              </Command.Item>
            </Command.Group>
          )}

          <Command.Group heading="Pages" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted">
            {PAGES.map((page) => {
              const Icon = page.icon;
              return (
                <Command.Item
                  key={page.href}
                  value={page.label}
                  onSelect={() => run(page.href)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm text-foreground aria-selected:bg-raised"
                >
                  <Icon className="size-4 text-muted" aria-hidden="true" />
                  <span>{page.label}</span>
                </Command.Item>
              );
            })}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
