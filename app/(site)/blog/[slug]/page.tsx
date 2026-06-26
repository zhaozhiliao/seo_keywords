import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { PostHeader } from "@/components/blog/post-header";
import { MDXContent } from "@/components/mdx/mdx-content";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { blogPostingJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    type: "article",
    date: post.date,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const path = `/blog/${slug}`;
  const crumbs = [{ label: "首页", href: "/" }, { label: "博客", href: "/blog" }, { label: post.title }] as const;

  return (
    <PageLayout width="content" crumbs={[...crumbs]} pagePath={path}>
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: post.description,
          path,
          date: post.date,
        })}
      />
      <article>
        <PostHeader title={post.title} description={post.description} date={post.date} tags={post.tags} />
        <MDXContent body={post.body} />
      </article>
    </PageLayout>
  );
}
