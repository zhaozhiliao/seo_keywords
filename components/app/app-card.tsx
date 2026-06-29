import { ArrowUpRight } from "lucide-react";
import { appBaseUrl } from "@/lib/app-url";
import { AppLogo } from "@/components/app/app-logo";
import type { AppConfig } from "@/lib/apps";

/** App card on the personal site's /apps overview. Links out to the App's own
    site (its subdomain). Uses the App's brandColor as a local accent. */
export function AppCard({ app }: { app: AppConfig }) {
  return (
    <a
      href={appBaseUrl(app.slug)}
      className="group flex flex-col rounded-lg border border-border bg-bg-card p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <AppLogo app={app} size="lg" />
        <ArrowUpRight
          size={16}
          className="text-fg-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
        />
      </div>
      <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-brand">{app.name}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-fg-muted">{app.tagline}</p>
      <span className="mt-3 truncate text-xs text-fg-subtle">{appBaseUrl(app.slug).replace(/^https?:\/\//, "")}</span>
    </a>
  );
}
