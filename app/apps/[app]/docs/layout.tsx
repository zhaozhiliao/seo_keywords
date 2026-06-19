import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { getApp } from "@/lib/apps";
import { getAppDocsNav } from "@/lib/content";

export default async function AppDocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ app: string }>;
}) {
  const { app: appSlug } = await params;
  const app = getApp(appSlug);
  const nav = getAppDocsNav(appSlug);
  if (!app || nav.length === 0) notFound();

  // Root-relative hrefs — the App is served at its own subdomain root.
  const items = nav.map((n) => ({
    title: n.title,
    href: `/docs${n.slugs.length ? "/" + n.slugs.join("/") : ""}`,
  }));

  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <DocsSidebar items={items} title="文档" />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
