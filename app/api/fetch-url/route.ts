import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Fetch a public URL and return its visible text content (best-effort). */
export async function POST(req: NextRequest) {
  let url = "";
  try {
    ({ url } = (await req.json()) as { url: string });
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "请输入合法的 http(s) 网址" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SEO-Toolkit/1.0; +https://example.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: `抓取失败：HTTP ${res.status}` }, { status: 502 });
    }
    const html = await res.text();

    // crude title + meta extraction
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
    const metaDesc =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ?? "";

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    // cap to keep prompt size reasonable
    const capped = text.slice(0, 12_000);
    return NextResponse.json({ title, description: metaDesc, text: capped });
  } catch (e) {
    return NextResponse.json({ error: `抓取失败：${String(e)}` }, { status: 502 });
  }
}
