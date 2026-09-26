import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Stack, useRouter } from "expo-router";

export default function DaysLayout() {
  const { t } = useTranslation();
  const router = useRouter();
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
        <Stack.Screen name="index" options={{ title: t("tabs.days") }} />
        <Stack.Screen name="entry/[id]" />
        <Stack.Screen
          name="settings"
          options={{
            title: t("settings.title"),
            headerTransparent: true,
            headerBackButtonMenuEnabled: true,
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: "modal",
            title: "",
            headerTransparent: true,
            unstable_headerRightItems: () => [
              {
                type: "button",
                label: t("common.cancel"),
                icon: { type: "sfSymbol", name: "xmark" },
                onPress: () => router.back(),
              },
            ],
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
