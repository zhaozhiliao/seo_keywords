import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { BlogList } from "@/components/blog/blog-list";
import { AppCard } from "@/components/app/app-card";
import { getBlogPosts } from "@/lib/content";
import { getAllApps } from "@/lib/apps";
import { webSiteJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

const HOME_DESCRIPTION =
  "wikipie 的个人站点：博客、文档、SEO 工具集合，以及多个 App 的介绍、文档与更新日志。";

export const metadata: Metadata = buildMetadata({
  title: "个人站点",
  description: HOME_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const posts = getBlogPosts().slice(0, 4);
  const apps = getAllApps();

  return (
    <PageLayout className="pb-8">
      <JsonLd data={webSiteJsonLd(HOME_DESCRIPTION)} />
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs text-fg-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          个人站点
        </div>
        <h1 className="max-w-3xl text-balance text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          你好
          <br />
          <span className="text-fg-muted">这里是我写的和做的东西。</span>
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg text-fg-muted">
          博客与文档、常用小工具，以及相关产品的介绍、文档和更新日志等等。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button render={<Link href="/blog" />} className="gap-2">
            Blog <ArrowRight size={16} />
          </Button>
          <Button variant="outline" render={<Link href="/tools" />}>
            Tools
          </Button>
        </div>
      </section>

      {/* Latest posts */}
      <section className="border-t border-border py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">最新文章</h2>
          <Link href="/blog" className="flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-brand">
            全部 <ArrowUpRight size={14} />
          </Link>
        </div>
        <BlogList posts={posts} base="/blog" />
      </section>

      {/* Apps */}
      {apps.length > 0 && (
        <section className="border-t border-border py-14">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-bold tracking-tight">我的 App</h2>
            <Link href="/apps" className="flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-brand">
              全部 <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((a) => (
              <AppCard key={a.slug} app={a} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
