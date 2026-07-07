"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Dictionary, Locale } from "@/lib/dictionary";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

export function Navbar({ name, dict, locale }: { name: string; dict: Dictionary; locale: Locale }) {
  const [active, setActive] = useState<string>("");

  const links = [
    { href: "#about", label: dict.nav.about },
    { href: "#experience", label: dict.nav.experience },
    { href: "#skills", label: dict.nav.skills },
    { href: "#projects", label: dict.nav.projects },
    { href: "#contact", label: dict.nav.contact },
  ];

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-accent">
            {initials}
          </span>
          <span className="hidden sm:inline">{name.split(" ").slice(0, 2).join(" ")}</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-surface hover:text-foreground sm:px-3",
                    active === link.href ? "text-accent" : "text-muted",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher locale={locale} />
        </div>
      </nav>
    </header>
  );
}
