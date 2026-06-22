import { SiteNav } from "@/components/nav/site-nav";
import { SiteFooter } from "@/components/footer/site-footer";

/** Chrome for the personal site (wikipie.com): global nav + footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        跳到主要内容
      </a>
      <SiteNav />
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
