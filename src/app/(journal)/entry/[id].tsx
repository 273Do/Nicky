import { Stack, useLocalSearchParams } from "expo-router";

import { EntryDetailView } from "@/components/entry/entry-detail";
import { ENTRIES } from "@/mocks/entries";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = ENTRIES.find((entry) => entry.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: entry?.title,
          headerLargeTitleEnabled: true,
          unstable_headerRightItems: () => [
            {
              type: "menu",
              label: "Options",
              icon: {
                type: "sfSymbol",
                name: "ellipsis",
              },
              menu: {
                items: [
                  {
                    type: "action",
                    icon: {
                      type: "sfSymbol",
                      name: entry?.bookmark ? "bookmark.fill" : "bookmark",
                    },
                    label: "Bookmark",
                    onPress: () => {
                      // Do something
                    },
                  },
                  {
                    type: "action",
                    label: "Delete",
                    icon: {
                      type: "sfSymbol",
                      name: "trash",
                    },
                    destructive: true,
                    onPress: () => {
                      // Do something
                    },
                  },
                ],
              },
            },
            {
              type: "button",
              label: "Edit",
              onPress: () => {
                // Do something
              },
            },
          ],
        }}
      />
      {entry && (
        <EntryDetailView
          id={id}
          date={entry.date}
          title={entry.title}
          preview={entry.preview}
          bookmark={entry.bookmark}
        />
      )}
    </>
  );
}
