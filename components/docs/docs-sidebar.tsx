"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DocsNavDrawer } from "@/components/docs/docs-nav-drawer";

export interface SidebarItem {
  title: string;
  href: string;
}

function SidebarList({ items, pathname }: { items: SidebarItem[]; pathname: string }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-brand-soft font-medium text-brand"
                  : "text-fg-muted hover:bg-bg-subtle hover:text-fg"
              )}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Left docs sidebar. Drawer on mobile, sticky column on desktop. */
export function DocsSidebar({ items, title = "文档" }: { items: SidebarItem[]; title?: string }) {
  const pathname = usePathname();
  const currentLabel = items.find((i) => i.href === pathname)?.title;

  return (
    <>
      <div className="lg:hidden">
        <DocsNavDrawer title={title} currentLabel={currentLabel}>
          <SidebarList items={items} pathname={pathname} />
        </DocsNavDrawer>
      </div>

      <aside className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-subtle">{title}</p>
        <SidebarList items={items} pathname={pathname} />
      </aside>
    </>
  );
}
