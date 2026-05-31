import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Header from "@/app/components/Header";

interface ToolShellProps {
  title: string;
  nameEn: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function ToolShell({ title, nameEn, description, icon: Icon, children }: ToolShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-xs">
          <Link href="/tools" className="text-muted-foreground transition-colors hover:text-foreground">
            SEO Toolkit
          </Link>
          <ChevronRight size={13} className="text-muted-foreground/50" />
          <Link href="/tools" className="text-muted-foreground transition-colors hover:text-foreground">
            工具
          </Link>
          <ChevronRight size={13} className="text-muted-foreground/50" />
          <span className="font-medium text-foreground">{title}</span>
        </nav>

        {/* Intro */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background ring-1 ring-black/[0.06]">
              <Icon size={18} className="text-foreground/80" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <p className="font-mono text-xs text-muted-foreground">{nameEn}</p>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        {children}
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        仅供个人使用 · Powered by AI
      </footer>
    </div>
  );
}
