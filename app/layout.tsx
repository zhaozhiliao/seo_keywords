import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ApiKeyProvider } from "@/app/context/ApiKeyContext";
import { AiKeysProvider } from "@/app/context/AiKeysContext";

export const metadata: Metadata = {
  title: "SEO Toolkit",
  description: "专业 SEO 数据工具集合，助力关键词研究、内容创作与结构化数据",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ApiKeyProvider>
          <AiKeysProvider>{children}</AiKeysProvider>
        </ApiKeyProvider>
      </body>
    </html>
  );
}
