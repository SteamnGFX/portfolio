import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const profile = await getProfile();

  return [
    {
      url: siteUrl,
      lastModified: profile?.updatedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
