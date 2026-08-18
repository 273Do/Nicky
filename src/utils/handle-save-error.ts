import { Alert } from "react-native";

import { z } from "zod";

import i18n from "@/i18n";

/**
 * 保存・更新処理の共通エラーハンドリング
 * - ZodError → バリデーションエラーを表示
 * - その他 → 汎用エラーを表示
 */
export const handleSaveError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    Alert.alert(i18n.t("error.validation"), error.issues[0].message);
  } else {
    Alert.alert(i18n.t("error.title"), i18n.t("error.unexpected"));
  }
};
