import type { CSSProperties } from "react";
import { AppSiteNav } from "@/components/app/app-site-nav";
import { AppSiteFooter } from "@/components/app/app-site-footer";
import type { AppConfig } from "@/lib/apps";

/** Chrome for an App's own site: its nav + footer, with the App's brandColor
    injected as --brand for the whole subtree. */
export function AppShell({
  app,
  hasDocs,
  hasChangelog,
  children,
}: {
  app: AppConfig;
  hasDocs: boolean;
  hasChangelog: boolean;
  children: React.ReactNode;
}) {
  const style = app.brandColor ? ({ "--brand": app.brandColor } as CSSProperties) : undefined;
  return (
    <div style={style} className="flex min-h-screen flex-col">
      <AppSiteNav app={app} hasDocs={hasDocs} hasChangelog={hasChangelog} />
      <main className="flex-1">{children}</main>
      <AppSiteFooter app={app} />
    </div>
  );
}
