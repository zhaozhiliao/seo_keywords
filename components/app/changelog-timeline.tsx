import { MDXContent } from "@/components/mdx/mdx-content";
import { formatDate } from "@/lib/format";
import type { DocEntry } from "@/lib/content";

/** Changelog as a version timeline (1Capture-style): sticky version + date on
    the left rail, rendered MDX entry on the right. */
export function ChangelogTimeline({ entries }: { entries: DocEntry[] }) {
  if (!entries.length) return <p className="text-sm text-fg-muted">还没有更新记录。</p>;
  return (
    <div className="divide-y divide-border">
      {entries.map((e) => (
        <section
          key={e.version}
          id={e.version}
          className="grid scroll-mt-24 gap-6 py-12 lg:grid-cols-[160px_minmax(0,1fr)]"
        >
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <span className="inline-block rounded-sm bg-brand-soft px-2 py-0.5 text-sm font-medium text-brand">
              {e.version}
            </span>
            {e.date && <p className="mt-2 text-sm text-fg-subtle">{formatDate(e.date)}</p>}
          </div>
          <div className="min-w-0">
            <h2 className="mb-4 text-xl font-semibold tracking-tight">{e.title}</h2>
            <MDXContent body={e.body} />
          </div>
        </section>
      ))}
    </div>
  );
}
