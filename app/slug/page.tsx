import { Link2 } from "lucide-react";
import ToolShell from "@/app/components/ToolShell";
import SlugGenerator from "@/app/components/SlugGenerator";

export default function SlugPage() {
  return (
    <ToolShell
      title="Slug 生成器"
      nameEn="Slug Generator"
      description="输入任意语言的文章标题或关键词，AI 生成 SEO 友好的英文 URL Slug：全小写、连字符分隔、去除停用词、语义清晰。"
      icon={Link2}
    >
      <SlugGenerator />
    </ToolShell>
  );
}
