import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  /** omit for the current (last) page */
  href?: string;
}

/** Hierarchical breadcrumb trail. Prefer `placement="bottom"` (Airbnb-style footer nav). */
export function Breadcrumbs({
  items,
  className,
  placement = "bottom",
}: {
  items: Crumb[];
  className?: string;
  /** `bottom` — below main content with a top rule; `top` — legacy above the title. */
  placement?: "top" | "bottom";
}) {
  const isBottom = placement === "bottom";

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs text-fg-muted",
        isBottom ? "mt-auto shrink-0 border-t border-border py-6" : "mb-5",
        className
      )}
      aria-label="面包屑"
    >
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {c.href && !last ? (
              <Link href={c.href} className="transition-colors hover:text-fg hover:underline">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-fg-muted" : undefined}>{c.label}</span>
            )}
            {!last && <ChevronRight size={13} className="text-fg-subtle" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}
