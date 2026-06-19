"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppLogo } from "@/components/app/app-logo";
import type { AppConfig } from "@/lib/apps";

/** An App site's own top nav: brand + parallel tabs (文档/更新日志) + a Download
    CTA. App-internal links are root-relative because each App is served at its
    own subdomain root (middleware rewrites to /apps/<slug>).

    Scroll interaction (à la open-design.ai): at the top the bar is immersed —
    flush, transparent, borderless. On scroll it lifts into a floating, semi-
    transparent rounded card that blurs the content passing under it. */
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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The logo links home, so tabs are just the parallel content sections.
  const tabs = [
    ...(hasDocs ? [{ href: "/docs", label: "文档", active: rel.startsWith("/docs") }] : []),
    ...(hasChangelog ? [{ href: "/changelog", label: "更新日志", active: rel.startsWith("/changelog") }] : []),
  ];

  const dl = app.external?.download;
  const site = app.external?.website ?? app.external?.github;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 ease-out",
        scrolled ? "px-3 pt-3" : "px-0 pt-0"
      )}
    >
      <div
        className={cn(
          "mx-auto border transition-all duration-300 ease-out",
          scrolled
            ? "rounded-[26px] border-border bg-bg/30 shadow-md backdrop-blur-2xl"
            : "border-transparent bg-transparent"
        )}
        style={{ maxWidth: "var(--page-max)" }}
      >
        <nav className="flex h-14 items-center gap-6 px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-80">
            <AppLogo app={app} size="md" />
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
              <Button size="sm" render={<a href={dl} target="_blank" rel="noreferrer" />} className="gap-1.5 rounded-full px-4">
                <Download size={14} /> Download
              </Button>
            ) : site ? (
              <Button size="sm" variant="outline" render={<a href={site} target="_blank" rel="noreferrer" />} className="gap-1.5 rounded-full px-4">
                <ExternalLink size={14} /> 官网
              </Button>
            ) : null}
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile tabs */}
        {tabs.length > 0 && (
          <div
            className={cn(
              "flex items-center gap-1 overflow-x-auto border-t px-6 py-2 md:hidden",
              scrolled ? "border-border" : "border-transparent"
            )}
          >
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
        )}
      </div>
    </header>
  );
}
