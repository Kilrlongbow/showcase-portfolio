"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="relative z-40">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-space focus:px-4 focus:py-2 focus:text-papaya"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="mx-auto flex h-20 max-w-[1440px] items-center justify-center px-4">
        <ul className="flex items-center gap-6 sm:gap-10">
          {links.map((link) => {
            const current = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "font-heading inline-flex min-h-11 items-center text-lg normal-case sm:text-xl",
                    "decoration-flag decoration-[3px] underline-offset-[6px] hover:text-flag",
                    current && "underline",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
