"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AppConfig } from "@/lib/apps";

const LABELS: Record<string, string> = { docs: "文档", blog: "博客", changelog: "更新日志" };

/** App-level contextual tab strip. Sits under the global nav as a light
    secondary bar (not a second header): a small brand dot + app name label,
    then the enabled subpages as underline tabs (§3). */
export function AppHeader({ app }: { app: AppConfig }) {
  const pathname = usePathname();
  const base = `/apps/${app.slug}`;

  const tabs = [
    { href: base, label: "介绍", match: (p: string) => p === base },
    ...app.nav.map((n) => ({
      href: `${base}/${n}`,
      label: LABELS[n],
      match: (p: string) => p === `${base}/${n}` || p.startsWith(`${base}/${n}/`),
    })),
  ];

  return (
    <div className="border-b border-border">
      <div className="mx-auto flex h-11 items-center gap-4 overflow-x-auto px-6" style={{ maxWidth: "var(--page-max)" }}>
        <Link href={base} className="flex shrink-0 items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg">
          <span className="h-2 w-2 rounded-full" style={{ background: app.brandColor ?? "var(--brand)" }} />
          {app.name}
        </Link>
        <span className="text-fg-subtle">/</span>
        <nav className="flex items-center gap-0.5">
          {tabs.map((t) => {
            const active = t.match(pathname);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "relative whitespace-nowrap px-2.5 py-1.5 text-sm transition-colors",
                  active ? "text-fg" : "text-fg-muted hover:text-fg"
                )}
              >
                {t.label}
                {active && <span className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-brand" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
