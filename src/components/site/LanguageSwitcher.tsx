"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LOCALE_COOKIE } from "@/lib/i18n-constants";
import type { Locale } from "@/lib/dictionary";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale) return;
    // document.cookie es una API imperativa del navegador, no estado de React
    // que este hook esté rastreando — no aplica la regla de inmutabilidad.
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center rounded-md border border-border bg-surface p-0.5 font-mono text-xs">
      {(["es", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          disabled={isPending}
          onClick={() => setLocale(code)}
          aria-current={locale === code}
          className={cn(
            "rounded px-2 py-1 uppercase transition-colors disabled:opacity-60",
            locale === code ? "bg-accent text-background" : "text-muted hover:text-foreground",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
