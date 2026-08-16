import { Alert } from "react-native";

import { z } from "zod";

/**
 * 保存・更新処理の共通エラーハンドリング
 * - ZodError → バリデーションエラーを表示
 * - その他 → 汎用エラーを表示
 */
export const handleSaveError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    Alert.alert("Validation Error", error.issues[0].message);
  } else {
    Alert.alert("Error", "An unexpected error occurred. Please try again.");
  }
};
