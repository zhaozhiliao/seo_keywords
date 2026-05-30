import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ApiKeyProvider } from "@/app/context/ApiKeyContext";

export const metadata: Metadata = {
  title: "SEO 工具集",
  description: "专业 SEO 数据工具集合，助力关键词研究、竞争分析与内容决策",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ApiKeyProvider>{children}</ApiKeyProvider>
      </body>
    </html>
  );
}
