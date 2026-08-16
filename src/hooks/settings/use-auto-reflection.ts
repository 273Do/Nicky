import { useEffect, useMemo, useRef } from "react";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getEntriesByDateQuery } from "@/db/queries/entries";
import { getReflectionByDateQuery, storeReflection } from "@/db/queries/reflections";
import { useAIReflectionSettings } from "@/hooks/settings/use-ai-reflection-settings";
import { startOfDay } from "@/utils/date";
import { getReflection } from "@/utils/days/reflection/get-reflection";

/** 現在時刻が reflectionTime を過ぎているか */
const isPastReflectionTime = (reflectionTime: Date): boolean => {
  const now = new Date();
  return (
    now.getHours() > reflectionTime.getHours() ||
    (now.getHours() === reflectionTime.getHours() &&
      now.getMinutes() >= reflectionTime.getMinutes())
  );
};

/**
 * アプリ起動時に今日の AI Reflection を自動生成するフック
 *
 * 以下の条件をすべて満たす場合に生成:
 * 1. aiReflectionEnabled が true
 * 2. 現在時刻が reflectionTime を過ぎている
 * 3. 今日の reflection が DB に未保存
 * 4. 今日のエントリーが1件以上ある
 */
export function useAutoReflection() {
  const { aiReflectionEnabled, aiModel, reflectionTime } = useAIReflectionSettings();
  const today = useMemo(() => startOfDay(), []);

  const { data: entries } = useLiveQuery(getEntriesByDateQuery(today), [today.getTime()]);
  const { data: reflection } = useLiveQuery(getReflectionByDateQuery(today), [today.getTime()]);
  const generating = useRef<boolean>(false);

  useEffect(() => {
    if (!aiReflectionEnabled) return;
    if (reflection) return;
    if (!entries || entries.length === 0) return;
    if (!isPastReflectionTime(reflectionTime)) return;
    if (generating.current) return;

    generating.current = true;
    (async () => {
      try {
        const result = await getReflection(entries, aiModel.gguf);
        if (result) await storeReflection(today, result);
      } catch (error) {
        console.warn("[auto-reflection]", error);
      } finally {
        generating.current = false;
      }
    })();
  }, [entries, reflection, aiReflectionEnabled, reflectionTime, aiModel.gguf, today]);
}
