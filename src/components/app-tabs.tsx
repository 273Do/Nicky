import { PlatformColor, useColorScheme } from "react-native";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function AppTabs() {
  const colorScheme = useColorScheme();

  return (
    // ダークモード時のチラつき防止
    // https://docs.expo.dev/router/advanced/native-tabs/#white-background-flashes-when-switching-tabs-on
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativeTabs tintColor={PlatformColor("systemIndigo")}>
        <NativeTabs.Trigger name="(journal)">
          <NativeTabs.Trigger.Label>Journal</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="books.vertical.fill" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="days">
          <NativeTabs.Trigger.Label>Days</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="calendar.day.timeline.leading" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="search" role="search">
          <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
