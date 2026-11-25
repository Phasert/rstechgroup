import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { absoluteUrl } from "@/lib/utils";

// Dynamic portfolio and article URLs are appended once those pages are wired to Firestore.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/", "/about", "/services", "/packages", "/work", "/resources", "/contact", "/quote"];
  // /privacy and /terms are excluded (noindex) until the owner approves their wording.
  return [
    ...staticPaths.map((p) => ({ url: absoluteUrl(p), lastModified: now, priority: p === "/" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: now, priority: 0.8 })),
  ];
}
