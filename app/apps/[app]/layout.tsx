import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { getAllApps, getApp } from "@/lib/apps";
import { appSiteMetadata } from "@/lib/app-metadata";
import { appHasDocs, appHasChangelog } from "@/lib/content";

export function generateStaticParams() {
  return getAllApps().map((a) => ({ app: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ app: string }> }): Promise<Metadata> {
  const { app: appSlug } = await params;
  const app = getApp(appSlug);
  if (!app) return {};
  return appSiteMetadata(app);
}

/** An App's own site chrome. Reached via its subdomain (<slug>.<root>), which
    middleware rewrites to /apps/<slug>. */
export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ app: string }>;
}) {
  const { app: appSlug } = await params;
  const app = getApp(appSlug);
  if (!app) notFound();

  return (
    <AppShell app={app} hasDocs={appHasDocs(app.slug)} hasChangelog={appHasChangelog(app.slug)}>
      {children}
    </AppShell>
  );
}
