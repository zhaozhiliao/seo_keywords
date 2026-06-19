import { NextResponse, type NextRequest } from "next/server";
import { ROOT_DOMAINS } from "@/lib/app-url";

/**
 * Subdomain routing: each App is its own site at `<slug>.<root>`. This rewrites
 * `<slug>.<root>/<path>` to the internal `/apps/<slug>/<path>` route. The bare
 * root domain (and www) serves the personal site untouched. Root domains come
 * from NEXT_PUBLIC_ROOT_DOMAIN (comma-separated; e.g. wikipie.com,piezora.cn).
 */
export function middleware(req: NextRequest) {
  const hostname = (req.headers.get("host") || "").toLowerCase().split(":")[0];

  for (const root of ROOT_DOMAINS) {
    const rootHost = root.split(":")[0];
    if (hostname === rootHost || hostname === `www.${rootHost}`) return NextResponse.next();

    if (hostname.endsWith(`.${rootHost}`)) {
      const sub = hostname.slice(0, hostname.length - rootHost.length - 1);
      if (sub && sub !== "www") {
        const url = req.nextUrl.clone();
        if (!url.pathname.startsWith(`/apps/${sub}`)) {
          url.pathname = `/apps/${sub}${url.pathname === "/" ? "" : url.pathname}`;
        }
        return NextResponse.rewrite(url);
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  // Skip API, Next internals, and files with an extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
