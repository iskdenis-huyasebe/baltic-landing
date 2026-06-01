import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unoweb.eu";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === routing.defaultLocale ? 1.0 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
  }));
}
