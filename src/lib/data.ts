import { prisma } from "@/lib/prisma";

export async function getProfile() {
  return prisma.profile.findUnique({ where: { id: 1 } });
}

export async function getExperiences() {
  // Cronológico: la más reciente/actual primero, sin importar el orden en que se hayan capturado.
  return prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { order: "desc" }],
  });
}

export async function getEducations() {
  return prisma.education.findMany({
    orderBy: [{ startDate: { sort: "desc", nulls: "last" } }, { order: "desc" }],
  });
}

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { order: "asc" } });
}

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_CHART_DAYS = 14;

export async function getAnalyticsSummary() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * DAY_MS);
  const thirtyDaysAgo = new Date(startOfToday.getTime() - 29 * DAY_MS);
  const chartStart = new Date(startOfToday.getTime() - (DAILY_CHART_DAYS - 1) * DAY_MS);

  const [totalViews, views7d, views30d, eventCounts, recentViews] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.analyticsEvent.groupBy({ by: ["type"], _count: { _all: true } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { createdAt: true },
    }),
  ]);

  const daily = new Map<string, number>();
  for (let i = 0; i < DAILY_CHART_DAYS; i++) {
    const d = new Date(chartStart.getTime() + i * DAY_MS);
    daily.set(d.toISOString().slice(0, 10), 0);
  }
  for (const view of recentViews) {
    const key = view.createdAt.toISOString().slice(0, 10);
    if (daily.has(key)) daily.set(key, (daily.get(key) ?? 0) + 1);
  }

  const countFor = (type: string) => eventCounts.find((e) => e.type === type)?._count._all ?? 0;

  return {
    totalViews,
    views7d,
    views30d,
    linkedinClicks: countFor("linkedin_click"),
    cvDownloads: countFor("cv_download"),
    githubClicks: countFor("github_click"),
    emailClicks: countFor("email_click"),
    daily: Array.from(daily.entries()).map(([date, count]) => ({ date, count })),
  };
}
