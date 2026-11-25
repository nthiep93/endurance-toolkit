import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { TOOLS } from "@/lib/registry";
import { GOALS } from "@/lib/goals";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(SITE.lastUpdated);
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...TOOLS.map((t) => ({
      url: `${SITE.url}/tools/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${SITE.url}/pace`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...GOALS.map((g) => ({
      url: `${SITE.url}/pace/${g.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/sponsor`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
