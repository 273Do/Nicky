import { Alert } from "react-native";

import { router } from "expo-router";
import { z } from "zod";

import i18n from "@/i18n";
import { ProRequiredError } from "@/utils/purchases/pro-gate";

/**
 * 保存・更新処理の共通エラーハンドリング
 * - ProRequiredError → ペイウォールを表示
 * - ZodError → バリデーションエラーを表示
 * - その他 → 汎用エラーを表示
 */
export const handleSaveError = (error: unknown) => {
  if (error instanceof ProRequiredError) {
    router.navigate("/(journal)/paywall");
  } else if (error instanceof z.ZodError) {
    Alert.alert(i18n.t("error.validation"), error.issues[0].message);
  } else {
    Alert.alert(i18n.t("error.title"), i18n.t("error.unexpected"));
  }
};
