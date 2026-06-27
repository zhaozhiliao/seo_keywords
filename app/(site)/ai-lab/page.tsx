import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { EXPLORATIONS, type Exploration } from "@/app/(site)/ai-lab/explorations";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Lab",
  description: "AI 相关的一些探索与实验，目前包括图片生成 prompt 图库等。",
  path: "/ai-lab",
});

export default function AiLabPage() {
  return (
    <PageLayout crumbs={[{ label: "首页", href: "/" }, { label: "AI Lab" }]} pagePath="/ai-lab">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Lab</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          关于 AI 的一些探索与实验。每一项都是独立的小专题，{EXPLORATIONS.length} 项进行中。
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXPLORATIONS.map((e) => (
          <ExplorationCard key={e.slug} exploration={e} />
        ))}
      </div>
    </PageLayout>
  );
}

function ExplorationCard({ exploration }: { exploration: Exploration }) {
  const Icon = exploration.icon;
  return (
    <Link
      href={`/ai-lab/${exploration.slug}`}
      className="group flex cursor-pointer flex-col rounded-lg border border-border bg-bg-card p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-bg-subtle transition-colors group-hover:bg-brand-soft">
          <Icon size={16} className="text-fg-muted transition-colors group-hover:text-brand" />
        </span>
        <ArrowUpRight
          size={16}
          className="text-fg-subtle transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
        />
      </div>
      <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-brand">
        {exploration.name}
      </h3>
      <p className="mt-0.5 font-mono text-[11px] text-fg-subtle">{exploration.nameEn}</p>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-fg-muted">{exploration.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {exploration.tags.map((tag) => (
          <span key={tag} className="rounded-sm bg-bg-subtle px-1.5 py-0.5 text-[11px] text-fg-subtle">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
