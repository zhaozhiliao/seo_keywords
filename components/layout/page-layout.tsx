import { Breadcrumbs, type Crumb } from "@/components/nav/breadcrumbs";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/** Page frame: content fills the main column; breadcrumbs sit above the site footer. */
export function PageLayout({
  children,
  crumbs,
  width = "page",
  className,
}: {
  children: React.ReactNode;
  crumbs?: Crumb[];
  width?: "page" | "content";
  className?: string;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Container width={width} className={cn("flex flex-1 flex-col pt-10", className)}>
        <div className="min-h-0 flex-1">{children}</div>
        {crumbs?.length ? <Breadcrumbs items={crumbs} placement="bottom" /> : null}
      </Container>
    </div>
  );
}
