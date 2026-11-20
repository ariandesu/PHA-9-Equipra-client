import Link from "next/link";
import Logo from "@/components/layout/logo";
import XLogo from "@/components/layout/x-logo";
import TextHoverEffect from "@/components/fx/text-hover-effect";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/equipment", label: "All Equipment" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/register", label: "Become an owner" },
    ],
  },
  {
    title: "Categories",
    links: [
      { href: "/equipment?category=Construction%20Equipment", label: "Construction" },
      { href: "/equipment?category=Photography%20Equipment", label: "Photography" },
      { href: "/equipment?category=Vehicles%20%26%20Transportation", label: "Vehicles" },
      { href: "/equipment?category=Event%20Equipment", label: "Event equipment" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: "mailto:support@equipra.app", label: "support@equipra.app" },
      { href: "tel:+8801700000000", label: "+880 1700-000000" },
      { label: "Banani, Dhaka 1213" },
    ],
  },
];

const socials = [
  {
    label: "Equipra on X",
    href: "https://x.com",
    icon: <XLogo />,
  },
  {
    label: "Equipra on Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1Z" />
      </svg>
    ),
  },
  {
    label: "Equipra on LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6h2.77v-7.6H6.46M7.85 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span>Equipra</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            A transparent rental marketplace connecting equipment owners with the
            people who need their gear.
          </p>
          <ul className="flex items-center gap-2 pt-2">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav
            key={column.title}
            id={column.title === "Contact" ? "contact" : undefined}
            className={column.title === "Contact" ? "scroll-mt-20" : undefined}
            aria-label={column.title}
          >
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Full-width giant wordmark row */}
      <div className="w-full overflow-hidden border-t border-border py-4 sm:py-6 flex justify-center text-center">
        <TextHoverEffect text="EQUIPRA" />
      </div>

      {/* Copyright row */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-6 text-xs text-subtle sm:flex-row max-w-[1100px] mx-auto">
        <p>© 2026 Equipra. All rights reserved.</p>
        <p className="font-mono text-[11px] tracking-wider text-muted">
          NEXT.JS · EXPRESS · MONGODB · STRIPE
        </p>
      </div>
    </footer>
  );
}
