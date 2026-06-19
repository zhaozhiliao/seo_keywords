import { SiteShell } from "@/components/layout/site-shell";

/** Personal site (wikipie.com) chrome. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
