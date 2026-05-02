import { PlatformColor, Pressable, useColorScheme } from "react-native";

import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { TemplateView } from "@/components/template/template-view";

/**
 * ジャーナル画面
 */
export default function TemplateListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Journal",
          headerTitleStyle: {
            color: titleColor,
          },
          headerShown: true,
          headerLargeTitleEnabled: true,
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <Pressable onPress={() => router.push("/template/create")}>
              <SymbolView name="plus" tintColor={PlatformColor("label")} />
            </Pressable>
          ),
        }}
      />
      <TemplateView />
    </>
  );
}
