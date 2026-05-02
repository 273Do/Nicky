import { PlatformColor, Pressable, useColorScheme } from "react-native";

import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { JournalView } from "@/components/journal/journal-view";

/**
 * ジャーナル画面
 */
export default function JournalListScreen() {
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
            <Pressable onPress={() => router.push("/(journal)/create")}>
              <SymbolView name="plus" tintColor={PlatformColor("label")} />
            </Pressable>
          ),
        }}
      />
      <JournalView />
    </>
  );
}
