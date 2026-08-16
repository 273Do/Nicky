/**
 * AI Reflection に使用できるモデルの定義
 */
export const AI_MODELS = [
  {
    id: "gemma-3-4b",
    label: "Gemma 3 4B",
    gguf: "ggml-org/gemma-3-4b-it-GGUF/gemma-3-4b-it-Q4_K_M.gguf",
  },
  {
    id: "qwen-3-4b",
    label: "Qwen 3 4B",
    gguf: "ggml-org/Qwen3-4B-GGUF/Qwen3-4B-Q4_K_M.gguf",
  },
  {
    id: "phi-4-mini",
    label: "Phi-4 Mini",
    gguf: "ggml-org/Phi-4-mini-instruct-GGUF/Phi-4-mini-instruct-Q4_K_M.gguf",
  },
] as const;

export type AIModelId = (typeof AI_MODELS)[number]["id"];

export const DEFAULT_MODEL_ID: AIModelId = "gemma-3-4b";
