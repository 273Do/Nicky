import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

import { Stack, useRouter } from "expo-router";

export default function JournalLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitleStyle: {
          color: titleColor,
        },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{
          presentation: "modal",
          gestureEnabled: false,
          headerShown: false,
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
  );
}
