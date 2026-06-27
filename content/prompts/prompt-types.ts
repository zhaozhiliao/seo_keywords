/** Shared types for the AI Lab prompt gallery. Each card is one `.md` file in
    `content/prompts/` — structured fields in frontmatter, the prompt text in the
    body. `lib/prompts.ts` reads them into `PromptEntry`. A prompt = one or more
    result images + the text that produced them + the model(s)/style(s) it suits. */

/** Suggested model tags. `models` accepts any string, but keeping to this list
    keeps the filter row tidy. */
export const KNOWN_MODELS = [
  "Image 2.0",
  "Midjourney",
  "Flux",
  "Stable Diffusion",
  "DALL·E 3",
  "Nano Banana",
  "Seedream",
  "Sora",
  "即梦",
  "可灵",
] as const;

/** Suggested style / mood tags — the second filter dimension (e.g. 情绪、极简).
    `styles` accepts any string; this list just keeps things consistent. */
export const KNOWN_STYLES = [
  "情绪",
  "极简",
  "复古",
  "插画",
  "摄影",
  "3D",
  "概念",
  "可爱",
  "暗调",
] as const;

export interface PromptEntry {
  /** Stable unique id (derived from the `.md` filename). */
  id: string;
  /** Full prompt text to copy verbatim (the file body, frontmatter stripped). */
  prompt: string;
  /** One or more result images. First is the cover. A bare filename like
      `"01.png"` is resolved to `/prompts/01.png`; a path starting with `/` or
      `http` is used as-is. */
  images: string[];
  /** Which model(s) this prompt is written for — rendered as tags + filter. */
  models: string[];
  /** Style / mood tags (e.g. `"情绪"`, `"极简"`) — rendered as tags + a second filter. */
  styles?: string[];
  /** Optional pin/sort weight (ascending); omit to sort by filename. */
  order?: number;
}
