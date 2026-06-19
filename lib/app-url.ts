/**
 * Subdomain URLs for App sites. Each App is its own site at `<slug>.<root>`.
 * Root domain(s) come from NEXT_PUBLIC_ROOT_DOMAIN (comma-separated; first is
 * canonical). Defaults to `localhost:3001` for local dev, where browsers route
 * `*.localhost` to loopback so `app1.localhost:3001` works out of the box.
 */
const RAW_ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3001";

export const ROOT_DOMAINS = RAW_ROOT.split(",").map((d) => d.trim()).filter(Boolean);
export const CANONICAL_ROOT = ROOT_DOMAINS[0];

function protocolFor(domain: string): string {
  return domain.includes("localhost") || domain.startsWith("127.") ? "http" : "https";
}

/** Absolute base URL for an App's own site, e.g. https://app1.wikipie.com */
export function appBaseUrl(slug: string): string {
  const root = CANONICAL_ROOT;
  return `${protocolFor(root)}://${slug}.${root}`;
}
