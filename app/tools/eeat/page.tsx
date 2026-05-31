import { BadgeCheck } from "lucide-react";
import ToolShell from "@/app/components/ToolShell";
import EeatEvaluator from "@/app/components/EeatEvaluator";

export default function EeatPage() {
  return (
    <ToolShell
      title="EEAT 评估"
      nameEn="E-E-A-T Evaluator"
      description="基于 Google 质量评估标准，从经验（Experience）、专业性（Expertise）、权威性（Authoritativeness）、可信度（Trust）四个维度评估页面内容，给出评分与可执行的优化建议。"
      icon={BadgeCheck}
    >
      <EeatEvaluator />
    </ToolShell>
  );
}
