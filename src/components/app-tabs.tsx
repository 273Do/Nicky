import { useTranslation } from "react-i18next";
import { PlatformColor, useColorScheme } from "react-native";

import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function AppTabs() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    // ダークモード時のチラつき防止
    // https://docs.expo.dev/router/advanced/native-tabs/#white-background-flashes-when-switching-tabs-on
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs tintColor={PlatformColor("systemIndigo")}>
        <NativeTabs.Trigger name="(journal)">
          <NativeTabs.Trigger.Label>{t("tabs.journal")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="books.vertical.fill" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="template">
          <NativeTabs.Trigger.Label>{t("tabs.template")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="folder.fill" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="search" role="search">
          <NativeTabs.Trigger.Label>{t("tabs.search")}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
