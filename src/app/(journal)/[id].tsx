import { useState } from "react";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { deleteAllEntries } from "@/db/queries/entries";

/**
 * ジャーナル詳細(エントリー一覧)
 */
export default function JournalScreen() {
  const router = useRouter();

  const { id: journalId, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const [bookmarkOnly, setBookmarkOnly] = useState(false);

  const handleDeleteAll = async () => {
    await deleteAllEntries(journalId).catch(console.error);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
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
                      name: "bookmark",
                    },
                    label: "Bookmarked Only",
                    state: bookmarkOnly ? "on" : "off",
                    onPress: () => setBookmarkOnly((prev) => !prev),
                  },
                  {
                    type: "action",
                    icon: {
                      type: "sfSymbol",
                      name: "ellipsis.circle",
                    },
                    label: "Edit",
                    onPress: () => {
                      router.push(`/(journal)/edit?journalId=${journalId}`);
                    },
                  },
                  {
                    type: "action",
                    icon: {
                      type: "sfSymbol",
                      name: "square.and.arrow.up.on.square",
                    },
                    label: "Export",
                    onPress: () => {
                      // Do something
                    },
                  },
                  {
                    type: "action",
                    label: "Delete All Entries",
                    icon: {
                      type: "sfSymbol",
                      name: "trash",
                    },
                    destructive: true,
                    onPress: handleDeleteAll,
                  },
                ],
              },
            },
          ],
        }}
      />
      {/* TODO: 空の場合の処理を追加する */}
      {/* エントリー一覧にはheaderTitleのデータは含まないので src/app/(journal)/entry/[id].tsx と混同しないように。 */}
      <EntryListView activeJournalId={journalId} journalName={name} bookmarkOnly={bookmarkOnly} />
    </>
  );
}
