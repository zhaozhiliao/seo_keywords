import { Code2 } from "lucide-react";
import ToolShell from "@/app/components/ToolShell";
import SchemaBuilder from "@/app/components/SchemaBuilder";

export default function SchemaPage() {
  return (
    <ToolShell
      title="Schema 生成器"
      nameEn="Schema Builder"
      description="可视化生成 Schema.org 结构化数据（JSON-LD），提升搜索结果富媒体展示。支持表单填写，或用 AI 从一段描述自动生成。"
      icon={Code2}
    >
      <SchemaBuilder />
    </ToolShell>
  );
}
