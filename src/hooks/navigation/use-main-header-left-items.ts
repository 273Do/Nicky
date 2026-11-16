import type { NativeStackHeaderItem } from "expo-router/native-stack";

import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

import { useRouter } from "expo-router";

/**
 * ジャーナル表示・Days 表示で共通のヘッダー左側アイテム（ペイウォール・設定）
 */
export const useMainHeaderLeftItems = (tab: "journal" | "template"): NativeStackHeaderItem[] => {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const appIcon =
    colorScheme === "dark"
      ? require("@/assets/images/app-logo/nav-icon-dark.png")
      : require("@/assets/images/app-logo/nav-icon.png");

  const href = tab === "journal" ? "(journal)" : "template";

  return [
    {
      type: "button",
      label: t("purchases.title"),
      icon: { type: "image", source: appIcon, tinted: false },
      onPress: () => router.push(`/${href}/paywall`),
    },
  ];
};
