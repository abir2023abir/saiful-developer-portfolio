import { env } from "./env";

/**
 * The canonical origin, used for metadata, sitemap.xml and robots.txt. Set
 * NEXT_PUBLIC_SITE_URL in production; the platform's own production URL is the
 * fallback so preview deployments still emit absolute links.
 */
export function siteUrl(): string {
  const explicit = env("SITE_URL") ?? env("NEXT_PUBLIC_SITE_URL");
  if (explicit)
    return explicit.endsWith("/") ? explicit.slice(0, -1) : explicit;

  const vercel = env("VERCEL_PROJECT_PRODUCTION_URL") ?? env("VERCEL_URL");
  if (vercel) return `https://${vercel}`;

  // Emitting localhost from a live deployment would put it in canonical tags and
  // in the sitemap submitted to search engines, so say so loudly instead.
  if (process.env.NODE_ENV === "production") {
    console.error(
      "No site origin configured. Set NEXT_PUBLIC_SITE_URL — canonical URLs and the sitemap are wrong until you do.",
    );
  }
  return "http://localhost:3200";
}
