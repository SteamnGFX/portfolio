"use server";

import { prisma } from "@/lib/prisma";

const EVENT_TYPES = ["linkedin_click", "cv_download", "github_click", "email_click"] as const;
export type AnalyticsEventType = (typeof EVENT_TYPES)[number];

export async function trackPageView(path: string) {
  try {
    await prisma.pageView.create({ data: { path } });
  } catch (error) {
    console.error("No se pudo registrar la visita:", error);
  }
}

export async function trackEvent(type: AnalyticsEventType) {
  if (!EVENT_TYPES.includes(type)) return;
  try {
    await prisma.analyticsEvent.create({ data: { type } });
  } catch (error) {
    console.error("No se pudo registrar el evento:", error);
  }
}
