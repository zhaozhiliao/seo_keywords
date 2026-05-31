import { Languages } from "lucide-react";
import ToolShell from "@/app/components/ToolShell";
import UiTranslator from "@/app/components/UiTranslator";

export default function UiTranslatePage() {
  return (
    <ToolShell
      title="UI 文案翻译"
      nameEn="UI Copy Translator"
      description="输入任意 UI 文案，一次翻译成多种语言，输出符合界面语境的地道表达。可自定义翻译提示词，控制语气、术语与风格。"
      icon={Languages}
    >
      <UiTranslator />
    </ToolShell>
  );
}
