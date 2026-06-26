import { Breadcrumbs, type Crumb } from "@/components/nav/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

/** Page frame: content fills the main column; breadcrumbs sit above the site footer. */
export function PageLayout({
  children,
  crumbs,
  pagePath,
  width = "page",
  className,
}: {
  children: React.ReactNode;
  crumbs?: Crumb[];
  /** Current page path for BreadcrumbList JSON-LD (e.g. `/blog/foo`). */
  pagePath?: string;
  width?: "page" | "content";
  className?: string;
}) {
  return (
    <div className="flex flex-1 flex-col">
      {crumbs?.length && pagePath ? <JsonLd data={breadcrumbJsonLd(crumbs, pagePath)} /> : null}
      <Container width={width} className={cn("flex flex-1 flex-col pt-10", className)}>
        <div className="min-h-0 flex-1">{children}</div>
        {crumbs?.length ? <Breadcrumbs items={crumbs} placement="bottom" /> : null}
      </Container>
    </div>
  );
}
