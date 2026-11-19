import Link from "next/link";
import Logo from "@/components/layout/logo";
import XLogo from "@/components/layout/x-logo";
import TextHoverEffect from "@/components/fx/text-hover-effect";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/equipment", label: "All equipment" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Categories",
    links: [
      { href: "/equipment?category=Construction%20Equipment", label: "Construction" },
      { href: "/equipment?category=Photography%20Equipment", label: "Photography" },
      { href: "/equipment?category=Vehicles%20%26%20Transportation", label: "Vehicles" },
      { href: "/equipment?category=Agriculture%20Equipment", label: "Agriculture" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About" },
      { href: "/#contact", label: "Contact" },
      { href: "/register", label: "List your equipment" },
      { href: "/login", label: "Log in" },
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
        <path d="M6.5 8.5a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5ZM5 10h3v9H5v-9Zm6 0h3v9h-3v-9Zm1.5-1.5a1.75 1.75 0 1 0 0-3.5a1.75 1.75 0 0 0 0 3.5ZM18 10c1.7 0 3 1.3 3 3v6h-3v-5.5c0-.3-.2-.5-.5-.5H16v6h-3v-9h5Zm-1.5-1.5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span>Equipra</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Bangladeshi equipment rental marketplace. Owners list heavy gear,
            admins approve it, renters book by the day, week or month.
          </p>
          <ul className="flex items-center gap-2 pt-2">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-raised hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/15"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-4 py-6 sm:flex-row">
        <p className="text-xs text-subtle">
          © Equipra. All rights reserved.
        </p>
        <TextHoverEffect text="EQUIPRA" />
      </div>
    </footer>
  );
}
