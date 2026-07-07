import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
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
