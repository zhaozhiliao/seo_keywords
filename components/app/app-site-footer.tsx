import Link from "next/link";
import { CANONICAL_ROOT } from "@/lib/app-url";
import type { AppConfig } from "@/lib/apps";

/** Footer for an App's own site. Links back to the personal site root. */
export function AppSiteFooter({ app }: { app: AppConfig }) {
  const homeUrl = `${CANONICAL_ROOT.includes("localhost") ? "http" : "https"}://${CANONICAL_ROOT}`;
  return (
    <footer className="mt-24 border-t border-border bg-bg-subtle">
      <div className="mx-auto flex flex-col gap-2 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between" style={{ maxWidth: "var(--page-max)" }}>
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold text-white"
            style={{ background: app.brandColor ?? "var(--brand)" }}
          >
            {app.name.charAt(0)}
          </span>
          <span className="font-medium">{app.name}</span>
          <span className="text-fg-subtle">· {app.tagline}</span>
        </div>
        <div className="flex items-center gap-4 text-fg-muted">
          <Link href="/" className="transition-colors hover:text-brand">介绍</Link>
          <a href={homeUrl} className="transition-colors hover:text-brand">wikipie ↗</a>
        </div>
      </div>
    </footer>
  );
}
