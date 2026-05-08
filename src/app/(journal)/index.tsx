import { PlatformColor, Pressable } from "react-native";

import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { JournalView } from "@/components/journal/journal-view";

/**
 * ジャーナル画面
 */
export default function JournalListScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Journal",
          headerLargeTitleEnabled: true,
          headerRight: () => (
            <Pressable onPress={() => router.push("/(journal)/create")}>
              <SymbolView
                name="folder.badge.plus"
                tintColor={PlatformColor("label")}
              />
            </Pressable>
          ),
        }}
      />
      {/* TODO: 空の場合の処理を追加する */}
      <JournalView />
    </>
  );
}
