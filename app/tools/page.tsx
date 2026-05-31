import Link from "next/link";
import { Search, BadgeCheck, Link2, Braces, Languages, ArrowRight, Layers, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ─── Tool registry ─────────────────────────────────────────────────────── */
interface Tool {
  slug: string;
  icon: LucideIcon;
  name: string;
  nameEn: string;
  description: string;
  tags: string[];
  href?: string;
}

const TOOLS: Tool[] = [
  {
    slug: "keywords",
    icon: Search,
    name: "关键词探索",
    nameEn: "Keyword Explorer",
    description: "查询全球各国搜索量、CPC 及竞争难度，支持批量导入与多语言对比。",
    tags: ["Ahrefs", "批量查询", "多语言"],
    href: "/tools/keywords",
  },
  {
    slug: "eeat",
    icon: BadgeCheck,
    name: "EEAT 评估",
    nameEn: "E-E-A-T Evaluator",
    description: "评估页面的经验、专业性、权威性与可信度，定位内容信任信号的优化空间。",
    tags: ["AI", "内容质量", "可信度"],
    href: "/tools/eeat",
  },
  {
    slug: "slug-generator",
    icon: Link2,
    name: "Slug 生成器",
    nameEn: "Slug Generator",
    description: "将标题或关键词转换为简洁、可读、适合 SEO 的 URL slug。",
    tags: ["AI", "URL 优化", "多语言"],
    href: "/tools/slug",
  },
  {
    slug: "schema-builder",
    icon: Braces,
    name: "Schema 生成器",
    nameEn: "Schema Builder",
    description: "快速生成常用结构化数据标记，帮助搜索引擎理解页面实体与内容类型。",
    tags: ["结构化数据", "JSON-LD", "AI"],
    href: "/tools/schema",
  },
  {
    slug: "ui-translation",
    icon: Languages,
    name: "UI 文案翻译",
    nameEn: "UI Copy Translator",
    description: "一次将界面文案翻译成多种语言，输出地道 UI 表达，支持自定义提示词。",
    tags: ["AI", "本地化", "多语言"],
    href: "/tools/ui-translate",
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ToolsPage() {
  const available = TOOLS.filter((t) => !!t.href);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 h-14 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-6">
          <Link href="/tools" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
              <Layers size={12} className="text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight">SEO Toolkit</span>
          </Link>

          <div className="ml-auto" />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center px-6 pb-16 pt-20 text-center">
        <div className="mb-8 flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {available.length} 个工具可用
        </div>

        <h1 className="mb-4 max-w-2xl text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          SEO 工具箱
          <br />
          <span className="text-muted-foreground/60">常用工具集合</span>
        </h1>

        <p className="mb-10 max-w-md text-base text-muted-foreground sm:text-lg">
          整理常用的 SEO 工具，方便做关键词查询、内容检查和页面优化。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/tools/keywords" />} className="gap-2">
            进入关键词探索
            <ArrowRight size={16} />
          </Button>
          <Button variant="outline" size="lg" render={<Link href="#tools" />}>
            查看全部工具
          </Button>
        </div>
      </section>

      {/* ── Tools section ── */}
      <section id="tools" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              工具集
            </p>
            <h2 className="text-xl font-bold tracking-tight">
              {available.length} 个工具已上线，更多即将推出
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        仅供个人使用 · Powered by Ahrefs & AI
      </footer>
    </div>
  );
}

/* ─── Tool card (compact) ────────────────────────────────────────────────── */
function ToolCard({ tool }: { tool: Tool }) {
  const available = !!tool.href;
  const Icon = tool.icon;

  const inner = (
    <div
      className={[
        "group relative flex flex-col h-full rounded-2xl p-4 transition-all duration-200",
        available
          ? "bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : "bg-card/60 opacity-70 cursor-default",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <Icon size={15} className="text-foreground/70" />
        </div>
        {available ? (
          <Badge variant="outline" className="gap-1 text-[10px] px-1.5 py-0.5 border-emerald-200 text-emerald-700 bg-emerald-50">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            可用
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">即将上线</Badge>
        )}
      </div>

      <p className="text-sm font-semibold leading-tight">{tool.name}</p>
      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">{tool.nameEn}</p>

      <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {tool.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {tool.tags.map((tag) => (
          <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      {available && (
        <div className="mt-3 flex items-center gap-0.5 text-xs font-medium text-foreground/70 transition-all group-hover:text-foreground group-hover:gap-1">
          进入工具
          <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}
    </div>
  );

  return available ? (
    <Link href={tool.href!} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full">{inner}</div>
  );
}
