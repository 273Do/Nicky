import { Alert } from "react-native";

import { router } from "expo-router";
import { z } from "zod";

import i18n from "@/i18n";
import { paywallHref, PaywallTab } from "@/utils/navigation/paywall-href";
import { ProRequiredError } from "@/utils/purchases/pro-gate";

/**
 * 保存・更新処理の共通エラーハンドリング
 * - ProRequiredError → ペイウォールを表示
 * - ZodError → バリデーションエラーを表示
 * - その他 → 汎用エラーを表示
 * @param error 発生したエラー
 * @param tab ペイウォールを開くタブ（呼び出し元のタブ）
 */
export const handleSaveError = (error: unknown, tab: PaywallTab = "journal") => {
  if (error instanceof ProRequiredError) {
    router.navigate(paywallHref(tab));
  } else if (error instanceof z.ZodError) {
    Alert.alert(i18n.t("error.validation"), error.issues[0].message);
  } else {
    Alert.alert(i18n.t("error.title"), i18n.t("error.unexpected"));
  }
};
