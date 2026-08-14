import { AI_MODELS, type AIModelId, DEFAULT_MODEL_ID } from "@/constants/ai-models";
import { setSetting, useSettingsQuery } from "@/db/queries/settings";

/** デフォルトの振り返り時間 */
const defaultReflectionTime = () => {
  const d = new Date();
  d.setHours(21, 0, 0, 0);
  return d;
};

const KEYS = {
  aiReflectionEnabled: "ai_reflection_enabled",
  aiModel: "ai_model",
  reflectionTime: "reflection_time",
} as const;

/**
 * AI Reflection の設定を読み書きするフック
 * @returns
 * - aiReflectionEnabled 振り返り機能の有効フラグ
 * - aiModel 選択中のモデル
 * - reflectionTime 振り返りを生成する時刻
 * - setAIReflectionEnabled 有効/無効を切り替えて DB に保存する
 * - setAIModel 使用モデルを切り替えて DB に保存する
 * - setReflectionTime 振り返りを生成する時刻を DB に保存する
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

  const storedTime = get(KEYS.reflectionTime);
  const reflectionTime = storedTime ? new Date(Number(storedTime)) : defaultReflectionTime();

  const setAIModel = async (modelId: AIModelId) => {
    await setSetting(KEYS.aiModel, modelId);
  };

  const setReflectionTime = async (date: Date) => {
    await setSetting(KEYS.reflectionTime, String(date.getTime()));
  };

  return {
    aiReflectionEnabled,
    aiModel,
    reflectionTime,
    setAIReflectionEnabled,
    setAIModel,
    setReflectionTime,
  } as const;
}
