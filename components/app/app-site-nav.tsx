"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { AppConfig } from "@/lib/apps";

/** An App site's own top nav: brand + parallel tabs (介绍/文档/更新日志) + a
    Download CTA. App-internal links are root-relative because each App is
    served at its own subdomain root (middleware rewrites to /apps/<slug>). */
export function AppSiteNav({
  app,
  hasDocs,
  hasChangelog,
}: {
  app: AppConfig;
  hasDocs: boolean;
  hasChangelog: boolean;
}) {
  const pathname = usePathname();
  // Normalize to an app-relative path (works on subdomain `/docs` and on the
  // internal `/apps/<slug>/docs` rewrite target alike).
  const rel = pathname.replace(/^\/apps\/[^/]+/, "") || "/";

  const tabs = [
    { href: "/", label: "介绍", active: rel === "/" },
    ...(hasDocs ? [{ href: "/docs", label: "文档", active: rel.startsWith("/docs") }] : []),
    ...(hasChangelog ? [{ href: "/changelog", label: "更新日志", active: rel.startsWith("/changelog") }] : []),
  ];

  const dl = app.external?.download;
  const site = app.external?.website ?? app.external?.github;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 items-center gap-6 px-6" style={{ maxWidth: "var(--page-max)" }}>
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-80">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md text-[13px] font-bold text-white"
            style={{ background: app.brandColor ?? "var(--brand)" }}
          >
            {app.name.charAt(0)}
          </span>
          <span className="text-sm">{app.name}</span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 md:flex">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                t.active ? "text-brand" : "text-fg-muted hover:text-fg"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {dl ? (
            <Button size="sm" render={<a href={dl} target="_blank" rel="noreferrer" />} className="gap-1.5">
              <Download size={14} /> Download
            </Button>
          ) : site ? (
            <Button size="sm" variant="outline" render={<a href={site} target="_blank" rel="noreferrer" />} className="gap-1.5">
              <ExternalLink size={14} /> 官网
            </Button>
          ) : null}
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-6 py-2 md:hidden">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
              t.active ? "text-brand" : "text-fg-muted hover:text-fg"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
