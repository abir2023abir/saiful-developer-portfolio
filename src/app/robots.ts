import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin panel and the write endpoints have no business in an index.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
