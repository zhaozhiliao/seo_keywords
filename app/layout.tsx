import type { Metadata } from "next";
import "./globals.css";
import { ApiKeyProvider } from "@/app/context/ApiKeyContext";

export const metadata: Metadata = {
  title: "Ahrefs Keyword Explorer",
  description: "查询关键词在各国的搜索量",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-50 min-h-screen antialiased text-gray-900">
        <ApiKeyProvider>{children}</ApiKeyProvider>
      </body>
    </html>
  );
}
