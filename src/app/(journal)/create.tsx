import { PlatformColor, Pressable } from "react-native";

import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { JournalCreateView } from "@/components/journal/journal-create-view";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "New Journal",
          headerRight: () => (
            <Pressable onPress={() => router.push("/(journal)/1")}>
              <SymbolView
                name="checkmark"
                tintColor={PlatformColor("systemIndigo")}
              />
            </Pressable>
          ),
        }}
      />
      <JournalCreateView />
    </>
  );
}
