import { prompts as promptDocs } from "@/.source/server";
import type { PromptEntry } from "@/content/prompts/prompt-types";

export type { PromptEntry };

/** Shape of a Fumadocs `doc` collection entry we rely on (frontmatter +
    DocMethods). The prompt text lives in the file body, read via getText. */
interface PromptDoc {
  images: string[];
  models: string[];
  styles?: string[];
  order?: number;
  info: { path: string };
  getText: (type: "raw" | "processed") => Promise<string>;
}

/** Drop the leading YAML frontmatter block, leaving the verbatim prompt body. */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

/** Accept bare filenames (`"01.png"`) → `/prompts/01.png`; leave absolute paths
    and URLs untouched. */
function resolveImage(src: string): string {
  return src.startsWith("/") || src.startsWith("http") ? src : `/prompts/${src}`;
}

const stripExt = (p: string) => p.replace(/\.mdx?$/, "");

/** All prompt cards, ordered by `order` then filename. Async because the prompt
    body is read from the source file at build time (SSG). */
export async function getAllPrompts(): Promise<PromptEntry[]> {
  const docs = promptDocs as unknown as PromptDoc[];
  const entries = await Promise.all(
    docs.map(async (d) => ({
      id: stripExt(d.info.path),
      prompt: stripFrontmatter(await d.getText("raw")),
      images: d.images.map(resolveImage),
      models: d.models ?? [],
      styles: d.styles,
      order: d.order,
    }))
  );
  return entries.sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.order ?? Number.MAX_SAFE_INTEGER;
    return ao !== bo ? ao - bo : a.id.localeCompare(b.id);
  });
}

/** Distinct tags in first-seen order — drives a filter row. */
function distinct(prompts: PromptEntry[], pick: (p: PromptEntry) => string[] | undefined): string[] {
  const seen = new Set<string>();
  for (const p of prompts) for (const v of pick(p) ?? []) seen.add(v);
  return Array.from(seen);
}

export function getPromptModels(prompts: PromptEntry[]): string[] {
  return distinct(prompts, (p) => p.models);
}

export function getPromptStyles(prompts: PromptEntry[]): string[] {
  return distinct(prompts, (p) => p.styles);
}
