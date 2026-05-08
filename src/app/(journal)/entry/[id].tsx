import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams } from "expo-router";

import { EntryDetailView } from "@/components/entry/entry-detail";
import { getEntryDetailQuery } from "@/db/queries/entries";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: entry } = useLiveQuery(getEntryDetailQuery(id));

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerBackButtonDisplayMode: "default",
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
      {entry && <EntryDetailView entry={entry} />}
    </>
  );
}
