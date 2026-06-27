import { Images } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** AI Lab explorations — single source of truth for the section index, the
    sub-routes, and the sitemap. Add an exploration: append here + create
    `app/(site)/ai-lab/<slug>/page.tsx`. */
export interface Exploration {
  slug: string;
  icon: LucideIcon;
  name: string;
  nameEn: string;
  description: string;
  tags: string[];
}

export const EXPLORATIONS: Exploration[] = [
  {
    slug: "prompts",
    icon: Images,
    name: "Prompt 图库",
    nameEn: "Prompt Gallery",
    description: "自用的图片生成 prompt 合集：看效果图、复制提示词，按模型筛选。",
    tags: ["图像生成", "Prompt", "多模型"],
  },
];

export function getExploration(slug: string): Exploration | undefined {
  return EXPLORATIONS.find((e) => e.slug === slug);
}
