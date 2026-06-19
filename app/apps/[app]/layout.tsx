import { notFound } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { getAllApps, getApp } from "@/lib/apps";
import { appHasDocs, appHasChangelog } from "@/lib/content";

export function generateStaticParams() {
  return getAllApps().map((a) => ({ app: a.slug }));
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
