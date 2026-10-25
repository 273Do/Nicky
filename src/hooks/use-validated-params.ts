import type { z } from "zod";

import { useLocalSearchParams } from "expo-router";

/**
 * useLocalSearchParams を Zod スキーマでバリデーションするフック
 */
export const useValidatedParams = <T extends z.ZodTypeAny>(schema: T): z.infer<T> => {
  const params = useLocalSearchParams();
  return schema.parse(params);
};
