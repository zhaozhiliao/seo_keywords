// ─── AI provider registry ──────────────────────────────────────────────
// Shared by client (key management UI) and server (chat proxy route).
// All providers are assumed OpenAI-compatible (chat/completions schema).
// DeepSeek is the first integration; add more entries here in the future.

export interface AiModel {
  id: string;
  label: string;
}

export interface AiProvider {
  id: string;
  name: string;
  /** OpenAI-compatible base URL (no trailing slash). */
  baseUrl: string;
  /** Chat completions path appended to baseUrl. */
  chatPath: string;
  defaultModel: string;
  models: AiModel[];
  docsUrl: string;
  keyPlaceholder: string;
  /** Where the user obtains the key. */
  keysUrl: string;
}

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    chatPath: "/chat/completions",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", label: "DeepSeek-V3 · deepseek-chat" },
      { id: "deepseek-reasoner", label: "DeepSeek-R1 · deepseek-reasoner" },
    ],
    docsUrl: "https://api-docs.deepseek.com/zh-cn/",
    keyPlaceholder: "sk-...",
    keysUrl: "https://platform.deepseek.com/api_keys",
  },
];

export function getProvider(id: string): AiProvider | undefined {
  return AI_PROVIDERS.find((p) => p.id === id);
}

export const DEFAULT_PROVIDER_ID = AI_PROVIDERS[0].id;

// localStorage keys
export const LS_AI_KEYS = "ai_provider_keys";
export const LS_AI_SELECTED = "ai_selected_provider";
