import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Everything is open to crawlers except the API. Sign-in and the account stay crawlable so search
// engines can read their noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
