import { useState } from "react";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useRouter } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { deleteAllEntries } from "@/db/queries/entries";
import { getJournalsQuery, JournalWithCountObj } from "@/db/queries/journals";

/**
 * ジャーナル画面（チップ切り替え + エントリー一覧）
 */
export default function JournalScreen() {
  const router = useRouter();

  const { data: journals } = useLiveQuery(getJournalsQuery);
  const journalList: JournalWithCountObj[] = journals ?? [];

  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null,
  );

  // 選択中のジャーナル（未選択 or 存在しない場合は先頭）
  const activeJournal =
    journalList.find((j) => j.id === selectedJournalId) ?? journalList[0];

  const [bookmarkOnly, setBookmarkOnly] = useState(false);

  const handleDeleteAll = async () => {
    if (!activeJournal) return;
    await deleteAllEntries(activeJournal.id).catch(console.error);
  };

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
            ...(activeJournal
              ? [
                  {
                    type: "menu" as const,
                    label: "Options",
                    icon: {
                      type: "sfSymbol" as const,
                      name: "ellipsis" as const,
                    },
                    menu: {
                      items: [
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: "bookmark" as const,
                          },
                          label: "Bookmarked Only",
                          state: bookmarkOnly
                            ? ("on" as const)
                            : ("off" as const),
                          onPress: () => setBookmarkOnly((prev) => !prev),
                        },
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: "ellipsis.circle" as const,
                          },
                          label: "Edit",
                          onPress: () => {
                            router.push(
                              `/(journal)/edit?journalId=${activeJournal.id}`,
                            );
                          },
                        },
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: "square.and.arrow.up.on.square" as const,
                          },
                          label: "Export",
                          onPress: () => {
                            // Do something
                          },
                        },
                        {
                          type: "action" as const,
                          label: "Delete All Entries",
                          icon: {
                            type: "sfSymbol" as const,
                            name: "trash" as const,
                          },
                          destructive: true,
                          onPress: handleDeleteAll,
                        },
                      ],
                    },
                  },
                ]
              : []),
          ],
        }}
      />
      {activeJournal ? (
        <EntryListView
          journals={journalList}
          activeJournalId={activeJournal.id}
          onSelectJournal={setSelectedJournalId}
          journalName={activeJournal.name}
          bookmarkOnly={bookmarkOnly}
        />
      ) : null}
    </>
  );
}
