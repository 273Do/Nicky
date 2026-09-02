import { DEFAULT_REFLECTION_HOUR } from "@/constants/reflection";
import { setSetting, useSettingsQuery } from "@/db/queries/settings";

/** デフォルトの振り返り時間 */
const defaultReflectionTime = () => {
  const d = new Date();
  d.setHours(DEFAULT_REFLECTION_HOUR, 0, 0, 0);
  return d;
};

const KEYS = {
  aiReflectionEnabled: "ai_reflection_enabled",
  reflectionTime: "reflection_time",
} as const;

/**
 * AI Reflection の設定を読み書きするフック
 * @returns
 * - aiReflectionEnabled 振り返り機能の有効フラグ
 * - reflectionTime 振り返りを生成する時刻
 * - setAIReflectionEnabled 有効/無効を切り替えて DB に保存する
 * - setReflectionTime 振り返りを生成する時刻を DB に保存する
 */
export function useAIReflectionSettings() {
  const { data: rows } = useSettingsQuery();

  const get = (key: string) => rows.find((r) => r.key === key)?.value ?? null;

  const aiReflectionEnabled = get(KEYS.aiReflectionEnabled) !== "false";

  const setAIReflectionEnabled = async (enabled: boolean) => {
    await setSetting(KEYS.aiReflectionEnabled, String(enabled));
  };

  const storedTime = get(KEYS.reflectionTime);
  const reflectionTime = storedTime ? new Date(Number(storedTime)) : defaultReflectionTime();

  const setReflectionTime = async (date: Date) => {
    await setSetting(KEYS.reflectionTime, String(date.getTime()));
  };

  return {
    aiReflectionEnabled,
    reflectionTime,
    setAIReflectionEnabled,
    setReflectionTime,
  } as const;
}
