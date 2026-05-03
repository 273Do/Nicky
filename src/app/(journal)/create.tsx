import { Stack } from "expo-router";

import { JournalCreateView } from "@/components/journal/journal-create-view";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Create New Journal",
        }}
      />
      <JournalCreateView />
    </>
  );
}
