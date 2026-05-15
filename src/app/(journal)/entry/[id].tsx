import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { EntryDetailView } from "@/components/entry/entry-detail";
import { deleteEntry, getEntryDetailQuery } from "@/db/queries/entries";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const router = useRouter();

  const { id: entryId, journalName } = useLocalSearchParams<{
    id: string;
    journalName: string;
  }>();

  const { data: entry } = useLiveQuery(getEntryDetailQuery(entryId));

  const handleDelete = async () => {
    await deleteEntry(entryId);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: journalName,
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
                    onPress: handleDelete,
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
      {/* TODO: 空の場合の処理を追加する */}
      {entry && <EntryDetailView entry={entry} />}
    </>
  );
}
