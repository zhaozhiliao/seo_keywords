import type { Metadata } from "next";
import type { AppConfig } from "@/lib/apps";

/** Per-App site metadata: own title template + favicon (overrides root wikipie defaults). */
export function appSiteMetadata(app: AppConfig): Metadata {
  return {
    title: {
      default: app.name,
      template: `%s · ${app.name}`,
    },
    ...(app.logo ? { icons: { icon: app.logo, apple: app.logo } } : {}),
    openGraph: { siteName: app.name },
  };
}
