import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PromptGallery } from "@/components/ai-lab/prompt-gallery";
import { getAllPrompts, getPromptModels, getPromptStyles } from "@/lib/prompts";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Prompt 图库",
  description: "自用的一些图片生成 prompt",
  path: "/ai-lab/prompts",
});

export default async function PromptGalleryPage() {
  const prompts = await getAllPrompts();
  const models = getPromptModels(prompts);
  const styles = getPromptStyles(prompts);

  return (
    <PageLayout
      crumbs={[{ label: "首页", href: "/" }, { label: "AI Lab", href: "/ai-lab" }, { label: "Prompt 图库" }]}
      pagePath="/ai-lab/prompts"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Prompt 图库</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          自用的一些图片生成 prompt，{prompts.length} 条
        </p>
      </header>
      <PromptGallery prompts={prompts} models={models} styles={styles} />
    </PageLayout>
  );
}
