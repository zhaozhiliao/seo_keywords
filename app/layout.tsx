import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ApiKeyProvider } from "@/components/context/ApiKeyContext";
import { AiKeysProvider } from "@/components/context/AiKeysContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://wikipie.com"),
  title: {
    default: "wikipie — 个人站点 · 工具集 · App 文档",
    template: "%s · wikipie",
  },
  description: "wikipie 的个人站点：博客、文档、SEO 工具集合，以及多个 App 的介绍、文档与更新日志。",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/** Root layout = document shell + providers only. Page chrome (nav/footer) is
    provided per area: the personal site via (site)/layout, an App site via
    AppShell — so the two never stack. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        <ThemeProvider>
          <ApiKeyProvider>
            <AiKeysProvider>{children}</AiKeysProvider>
          </ApiKeyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
