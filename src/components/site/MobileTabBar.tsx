"use client";

import { useTransition, type SVGProps } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/useActiveSection";
import { LOCALE_COOKIE } from "@/lib/i18n-constants";
import type { Dictionary, Locale } from "@/lib/dictionary";
import { AboutIcon, ExperienceIcon, ProjectsIcon, ContactIcon, GlobeIcon } from "@/components/site/icons";

export function MobileTabBar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const items = [
    { href: "#about", label: dict.nav.about, Icon: AboutIcon },
    { href: "#experience", label: dict.nav.experience, Icon: ExperienceIcon },
    { href: "#skills", label: dict.nav.skills, Icon: SkillsGlyph },
    { href: "#projects", label: dict.nav.projects, Icon: ProjectsIcon },
    { href: "#contact", label: dict.nav.contact, Icon: ContactIcon },
  ];

  const active = useActiveSection(items.map((i) => i.href));

  function toggleLocale() {
    const next: Locale = locale === "es" ? "en" : "es";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => router.refresh());
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border/60 bg-background/90 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
            active === href ? "text-accent" : "text-muted",
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="max-w-full truncate px-0.5">{label}</span>
        </a>
      ))}
      <button
        type="button"
        onClick={toggleLocale}
        disabled={isPending}
        className="flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted transition-colors disabled:opacity-60"
      >
        <GlobeIcon className="h-5 w-5" />
        <span>{locale.toUpperCase()}</span>
      </button>
    </nav>
  );
}

function SkillsGlyph({ className }: SVGProps<SVGSVGElement>) {
  return (
    <span
      className={cn("flex items-center justify-center font-mono text-[13px] font-bold leading-none", className)}
      aria-hidden
    >
      {"</>"}
    </span>
  );
}
