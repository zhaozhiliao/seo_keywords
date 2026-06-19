import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ChangelogTimeline } from "@/components/app/changelog-timeline";
import { getApp } from "@/lib/apps";
import { getAppChangelog, appHasChangelog } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { appBaseUrl } from "@/lib/app-url";

export async function generateMetadata({ params }: { params: Promise<{ app: string }> }): Promise<Metadata> {
  const { app: appSlug } = await params;
  const app = getApp(appSlug);
  if (!app) return {};
  return buildMetadata({
    title: `${app.name} 更新日志`,
    description: `${app.name} 的版本更新记录。`,
    path: `${appBaseUrl(app.slug)}/changelog`,
  });
}

export default async function AppChangelogPage({ params }: { params: Promise<{ app: string }> }) {
  const { app: appSlug } = await params;
  const app = getApp(appSlug);
  if (!app || !appHasChangelog(appSlug)) notFound();

  const entries = getAppChangelog(appSlug);

  return (
    <Container width="content" className="py-12">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">更新日志</h1>
        <p className="mt-2 text-fg-muted">新增功能与优化。</p>
      </header>
      <ChangelogTimeline entries={entries} />
    </Container>
  );
}
