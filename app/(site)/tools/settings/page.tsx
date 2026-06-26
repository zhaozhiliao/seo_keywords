import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import ToolShell from "@/components/tools/ToolShell";
import ApiManager from "@/components/tools/ApiManager";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "API 设置",
  description: "集中管理 Ahrefs 与 AI 模型的 API 凭据，所有 Key 仅保存在本地浏览器。",
  path: "/tools/settings",
});

export default function SettingsPage() {
  return (
    <ToolShell
      title="API 设置"
      nameEn="API Settings"
      description="集中管理所有第三方 API 凭据。所有 Key 仅缓存在本地浏览器中，不会上传服务器。"
      icon={KeyRound}
      pagePath="/tools/settings"
      crumbs={[{ label: "首页", href: "/" }, { label: "工具", href: "/tools" }, { label: "API 设置" }]}
    >
      <ApiManager />
    </ToolShell>
  );
}
