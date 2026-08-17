import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Stack } from "expo-router";

export default function DaysLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitleStyle: {
            color: titleColor,
          },
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="settings"
          options={{
            title: t("settings.title"),
            headerTransparent: true,
            headerBackButtonMenuEnabled: true,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
