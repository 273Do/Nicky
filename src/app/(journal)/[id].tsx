import { useState } from "react";

import { Stack, useLocalSearchParams } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { deleteAllEntries } from "@/db/queries/entries";

/**
 * ソート一覧
 */
export type SortKey =
  | "dateDesc"
  | "dateAsc"
  | "titleAsc"
  | "titleDesc"
  | "bookmark";

/**
 * ソートラベル
 */
const SORT_LABELS: Record<SortKey, string> = {
  dateDesc: "Newest First",
  dateAsc: "Oldest First",
  titleAsc: "Title (A→Z)",
  titleDesc: "Title (Z→A)",
  bookmark: "Bookmarked",
};

/**
 * ジャーナル詳細(エントリー一覧)
 */
export default function JournalScreen() {
  const { id: journalId, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();
  const [searchText, setSearchText] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("dateDesc");

  const handleDeleteAll = async () => {
    // TODO: 削除できないので後ほど修正
    console.log("handleDeleteAll called, journalId:", journalId);
    try {
      await deleteAllEntries(journalId);
      console.log("deleteAllEntries completed");
    } catch (e) {
      console.error("deleteAllEntries error:", e);
    }
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
            onChangeText: (e) => setSearchText(e.nativeEvent.text),
            onCancelButtonPress: () => setSearchText(""),
          },
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
                    type: "submenu",
                    label: "",
                    inline: true,
                    items: [
                      {
                        type: "submenu",
                        label: "Sort",
                        details: SORT_LABELS[sortKey],
                        icon: {
                          type: "sfSymbol",
                          name: "arrow.up.arrow.down",
                        },
                        items: [
                          {
                            type: "action",
                            label: "Newest First",
                            state: sortKey === "dateDesc" ? "on" : "off",
                            onPress: () => setSortKey("dateDesc"),
                          },
                          {
                            type: "action",
                            label: "Oldest First",
                            state: sortKey === "dateAsc" ? "on" : "off",
                            onPress: () => setSortKey("dateAsc"),
                          },
                          {
                            type: "action",
                            label: "Title (A→Z)",
                            state: sortKey === "titleAsc" ? "on" : "off",
                            onPress: () => setSortKey("titleAsc"),
                          },
                          {
                            type: "action",
                            label: "Title (Z→A)",
                            state: sortKey === "titleDesc" ? "on" : "off",
                            onPress: () => setSortKey("titleDesc"),
                          },
                          {
                            type: "action",
                            label: "Bookmarked",
                            state: sortKey === "bookmark" ? "on" : "off",
                            onPress: () => setSortKey("bookmark"),
                          },
                        ],
                      },
                      {
                        type: "action",
                        icon: {
                          type: "sfSymbol",
                          name: "ellipsis.circle",
                        },
                        label: "Edit Journal",
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
                    ],
                  },
                  {
                    type: "action",
                    label: "Delete All",
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
        searchText={searchText}
        sortKey={sortKey}
      />
    </>
  );
}
