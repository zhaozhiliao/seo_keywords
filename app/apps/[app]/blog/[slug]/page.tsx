import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { PostHeader } from "@/components/blog/post-header";
import { MDXContent } from "@/components/mdx/mdx-content";
import { getApp, appHasNav, getAllApps } from "@/lib/apps";
import { getAppBlogPost, getAppBlogPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllApps()
    .filter((a) => a.nav.includes("blog"))
    .flatMap((a) => getAppBlogPosts(a.slug).map((p) => ({ app: a.slug, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ app: string; slug: string }> }): Promise<Metadata> {
  const { app, slug } = await params;
  const post = getAppBlogPost(app, slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/apps/${app}/blog/${slug}`,
    type: "article",
    date: post.date,
  });
}

export default async function AppBlogPostPage({ params }: { params: Promise<{ app: string; slug: string }> }) {
  const { app: appSlug, slug } = await params;
  const app = getApp(appSlug);
  if (!app || !appHasNav(app, "blog")) notFound();

  const post = getAppBlogPost(appSlug, slug);
  if (!post) notFound();

  return (
    <Container width="content" className="py-12">
      <Breadcrumbs
        items={[
          { label: "Apps", href: "/apps" },
          { label: app.name, href: `/apps/${app.slug}` },
          { label: "博客", href: `/apps/${app.slug}/blog` },
          { label: post.title },
        ]}
      />
      <article>
        <PostHeader title={post.title} description={post.description} date={post.date} tags={post.tags} />
        <MDXContent body={post.body} />
      </article>
    </Container>
  );
}
