import { cookies, headers } from "next/headers";
import type { Locale } from "@/lib/dictionary";
import { LOCALE_COOKIE } from "@/lib/i18n-constants";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale === "en" || cookieLocale === "es") return cookieLocale;

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") ?? "";
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  return preferred === "en" ? "en" : "es";
}
