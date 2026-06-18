import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { BlogList } from "@/components/blog/blog-list";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { getApp, appHasNav } from "@/lib/apps";
import { getAppBlogPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ app: string }> }): Promise<Metadata> {
  const { app: appSlug } = await params;
  const app = getApp(appSlug);
  if (!app) return {};
  return buildMetadata({ title: `${app.name} 博客`, description: `${app.name} 的动态与文章。`, path: `/apps/${app.slug}/blog` });
}

export default async function AppBlogPage({ params }: { params: Promise<{ app: string }> }) {
  const { app: appSlug } = await params;
  const app = getApp(appSlug);
  if (!app || !appHasNav(app, "blog")) notFound();

  const posts = getAppBlogPosts(app.slug);
  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Apps", href: "/apps" },
          { label: app.name, href: `/apps/${app.slug}` },
          { label: "博客" },
        ]}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{app.name} 博客</h1>
        <p className="mt-2 text-fg-muted">{app.name} 的动态与文章。</p>
      </header>
      <BlogList posts={posts} base={`/apps/${app.slug}/blog`} />
    </Container>
  );
}
