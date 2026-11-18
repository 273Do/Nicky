import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Stack, useRouter } from "expo-router";

// 共有リンクなどで子画面が直接開かれても、戻るとジャーナル一覧に戻れるようにする
export const unstable_settings = {
  anchor: "index",
};

export default function JournalLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  return (
    // Days 画面のスワイプジェスチャーに必要
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
        <Stack.Screen
          name="onboarding"
          options={{
            presentation: "modal",
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="days"
          options={{
            title: t("tabs.days"),
            headerLargeTitleEnabled: false,
            // ジャーナル画面との表示切り替えとして見せる
            animation: "none",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: t("settings.title"),
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
