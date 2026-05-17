import { Stack, useRouter } from "expo-router";

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
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: "Create New Journal",
              icon: { type: "sfSymbol", name: "folder.badge.plus" },
              onPress: () => router.push("/(journal)/create"),
            },
          ],
        }}
      />
      {/* TODO: 空の場合の処理を追加する */}
      <JournalView />
    </>
  );
}
