import { useState } from "react";

import { Stack, useLocalSearchParams } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { deleteAllEntries } from "@/db/queries/entries";
import { SortKey } from "@/utils/entry/consts";

/**
 * ジャーナル詳細(エントリー一覧)
 */
export default function JournalScreen() {
  const {
    id: journalId,
    name,
    // edit,
  } = useLocalSearchParams<{
    id: string;
    name: string;
    edit: string;
  }>();

  // const [editMode, setEditMode] = useState<boolean>(Boolean(edit));

  const [filter, setFilter] = useState<{
    searchText: string;
    sortKey: SortKey;
  }>({
    searchText: "",
    sortKey: "dateDesc",
  });

  const handleDeleteAll = async () => {
    await deleteAllEntries(journalId).catch(console.error);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerLargeTitleEnabled: true,
          headerSearchBarOptions: {
            placeholder: "Search",
            hideWhenScrolling: false,
            onChangeText: (e) => {
              const text = e.nativeEvent?.text ?? "";
              setFilter((prev) => ({ ...prev, searchText: text }));
            },
            onCancelButtonPress: () =>
              setFilter((prev) => ({ ...prev, searchText: "" })),
          },
          unstable_headerRightItems: () => [
            {
              type: "menu",
              label: "Sort",
              icon: {
                type: "sfSymbol",
                name: "arrow.up.arrow.down",
              },
              menu: {
                items: [
                  {
                    type: "action",
                    label: "Newest First",
                    state: filter.sortKey === "dateDesc" ? "on" : "off",
                    onPress: () =>
                      setFilter((prev) => ({ ...prev, sortKey: "dateDesc" })),
                  },
                  {
                    type: "action",
                    label: "Oldest First",
                    state: filter.sortKey === "dateAsc" ? "on" : "off",
                    onPress: () =>
                      setFilter((prev) => ({ ...prev, sortKey: "dateAsc" })),
                  },
                  {
                    type: "action",
                    label: "Title (A→Z)",
                    state: filter.sortKey === "titleAsc" ? "on" : "off",
                    onPress: () =>
                      setFilter((prev) => ({ ...prev, sortKey: "titleAsc" })),
                  },
                  {
                    type: "action",
                    label: "Title (Z→A)",
                    state: filter.sortKey === "titleDesc" ? "on" : "off",
                    onPress: () =>
                      setFilter((prev) => ({ ...prev, sortKey: "titleDesc" })),
                  },
                  {
                    type: "action",
                    label: "Bookmarked",
                    state: filter.sortKey === "bookmark" ? "on" : "off",
                    onPress: () =>
                      setFilter((prev) => ({ ...prev, sortKey: "bookmark" })),
                  },
                ],
              },
            },
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
                      name: "ellipsis.circle",
                    },
                    label: "Edit",
                    onPress: () => {
                      // Do something
                      console.log("Edit Journal");
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
      <EntryListView
        journalId={journalId}
        journalName={name}
        searchText={filter.searchText}
        sortKey={filter.sortKey}
      />
    </>
  );
}
