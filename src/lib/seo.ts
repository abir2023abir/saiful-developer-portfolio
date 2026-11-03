import type { Metadata } from "next";
import type { Project, SiteSettings } from "./types";
import { siteUrl } from "./site-url";

type PageMeta = {
  title?: string | { absolute: string };
  description: string;
  /** Path beginning with `/`. `/` is the homepage. */
  path: string;
  images?: string[];
};

/** Unique title, description and canonical URL for one public page. */
export function pageMeta({
  title,
  description,
  path,
  images,
}: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: typeof title === "string" ? title : title?.absolute,
      description,
      url: path,
      type: "website",
      ...(images?.length ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: typeof title === "string" ? title : title?.absolute,
      description,
      ...(images?.length ? { images } : {}),
    },
  };
}

/** A profile URL with no path is a placeholder homepage, not this person. */
export function profileLinks(urls: Array<string | undefined>): string[] {
  return urls.filter((url): url is string => {
    if (!url) return false;
    try {
      return new URL(url).pathname.replace(/\/+$/, "").length > 1;
    } catch {
      return false;
    }
  });
}

function postalAddress(location: string) {
  const match = location.match(/^(.*?),\s*([A-Za-z ]+)-(\d{4})$/);
  if (!match) {
    return {
      "@type": "PostalAddress",
      streetAddress: location,
      addressCountry: "BD",
    };
  }
  return {
    "@type": "PostalAddress",
    streetAddress: match[1],
    addressLocality: match[2].trim(),
    postalCode: match[3],
    addressCountry: "BD",
  };
}

export function siteJsonLd(site: SiteSettings, description: string) {
  const origin = siteUrl();
  const sameAs = profileLinks([site.github, site.linkedin, site.upwork]);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${origin}/#person`,
        name: site.name,
        jobTitle: site.role,
        description,
        email: `mailto:${site.email}`,
        url: origin,
        address: postalAddress(site.location),
        areaServed: { "@type": "City", name: "Dhaka" },
        knowsAbout: site.stack,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: site.name,
        url: origin,
        inLanguage: "en",
        description,
        publisher: { "@id": `${origin}/#person` },
      },
    ],
  };
}

export function breadcrumbJsonLd(
  crumbs: Array<{ name: string; path: string }>,
) {
  const origin = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${origin}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}

export function projectJsonLd(project: Project, author: string) {
  const origin = siteUrl();
  const image = project.image
    ? project.image.startsWith("http")
      ? project.image
      : `${origin}${project.image}`
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${origin}/work/${project.slug}`,
    genre: project.category,
    keywords: project.stack.join(", "),
    ...(image ? { image } : {}),
    creator: {
      "@type": "Person",
      name: author,
      url: origin,
    },
  };
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
