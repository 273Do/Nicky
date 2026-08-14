import { AI_MODELS, type AIModelId, DEFAULT_MODEL_ID } from "@/constants/ai-models";
import { setSetting, useSettingsQuery } from "@/db/queries/settings";

const KEYS = {
  aiReflectionEnabled: "ai_reflection_enabled",
  aiModel: "ai_model",
} as const;

/**
 * AI Reflection の設定を読み書きするフック
 */
export function useAIReflectionSettings() {
  const { data: rows } = useSettingsQuery();

  const get = (key: string) => rows.find((r) => r.key === key)?.value ?? null;

  const aiReflectionEnabled = get(KEYS.aiReflectionEnabled) !== "false";

  const storedModelId = get(KEYS.aiModel) as AIModelId | null;
  const aiModel =
    AI_MODELS.find((m) => m.id === storedModelId) ??
    AI_MODELS.find((m) => m.id === DEFAULT_MODEL_ID)!;

  const setAIReflectionEnabled = async (enabled: boolean) => {
    await setSetting(KEYS.aiReflectionEnabled, String(enabled));
  };

  const setAIModel = async (modelId: AIModelId) => {
    await setSetting(KEYS.aiModel, modelId);
  };

  return {
    aiReflectionEnabled,
    aiModel,
    setAIReflectionEnabled,
    setAIModel,
  } as const;
}
