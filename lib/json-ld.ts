import type { Crumb } from "@/components/nav/breadcrumbs";

export const SITE_ORIGIN = "https://wikipie.com";
export const SITE_NAME = "wikipie";

/** Absolute URL for JSON-LD / sitemap helpers. */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** BreadcrumbList JSON-LD — `pagePath` is the current page (last crumb). */
export function breadcrumbJsonLd(crumbs: Crumb[], pagePath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(i === crumbs.length - 1 ? pagePath : (c.href ?? pagePath)),
    })),
  };
}

export function webSiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    description,
    inLanguage: "zh-CN",
  };
}

export function blogPostingJsonLd({
  title,
  description,
  path,
  date,
}: {
  title: string;
  description?: string;
  path: string;
  date?: string | Date;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    ...(description ? { description } : {}),
    ...(date ? { datePublished: new Date(date).toISOString() } : {}),
    author: { "@type": "Person", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "zh-CN",
  };
}
