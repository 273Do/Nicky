import { useState } from "react";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useRouter } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { deleteAllEntries } from "@/db/queries/entries";
import { getJournalsQuery, JournalWithCountObj } from "@/db/queries/journals";
import { SortKey } from "@/utils/entry/consts";

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

  const [filter, setFilter] = useState<{
    searchText: string;
    sortKey: SortKey;
  }>({
    searchText: "",
    sortKey: "dateDesc",
  });

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
                    label: "Sort",
                    icon: {
                      type: "sfSymbol" as const,
                      name: "arrow.up.arrow.down" as const,
                    },
                    menu: {
                      items: [
                        {
                          type: "action" as const,
                          label: "Newest First",
                          state:
                            filter.sortKey === "dateDesc"
                              ? ("on" as const)
                              : ("off" as const),
                          onPress: () =>
                            setFilter((prev) => ({
                              ...prev,
                              sortKey: "dateDesc",
                            })),
                        },
                        {
                          type: "action" as const,
                          label: "Oldest First",
                          state:
                            filter.sortKey === "dateAsc"
                              ? ("on" as const)
                              : ("off" as const),
                          onPress: () =>
                            setFilter((prev) => ({
                              ...prev,
                              sortKey: "dateAsc",
                            })),
                        },
                        {
                          type: "action" as const,
                          label: "Title (A→Z)",
                          state:
                            filter.sortKey === "titleAsc"
                              ? ("on" as const)
                              : ("off" as const),
                          onPress: () =>
                            setFilter((prev) => ({
                              ...prev,
                              sortKey: "titleAsc",
                            })),
                        },
                        {
                          type: "action" as const,
                          label: "Title (Z→A)",
                          state:
                            filter.sortKey === "titleDesc"
                              ? ("on" as const)
                              : ("off" as const),
                          onPress: () =>
                            setFilter((prev) => ({
                              ...prev,
                              sortKey: "titleDesc",
                            })),
                        },
                        {
                          type: "action" as const,
                          label: "Bookmarked",
                          state:
                            filter.sortKey === "bookmark"
                              ? ("on" as const)
                              : ("off" as const),
                          onPress: () =>
                            setFilter((prev) => ({
                              ...prev,
                              sortKey: "bookmark",
                            })),
                        },
                      ],
                    },
                  },
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
          searchText={filter.searchText}
          sortKey={filter.sortKey}
        />
      ) : null}
    </>
  );
}
