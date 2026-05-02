import { useState } from "react";

import { Stack, useLocalSearchParams } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { JOURNALS } from "@/mocks/journals";

/**
 * ジャーナル一覧
 */
export default function JournalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [searchText, setSearchText] = useState("");

  const journal = JOURNALS.find((journal) => journal.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: journal?.name,
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
                    label: "Sort",
                    icon: {
                      type: "sfSymbol",
                      name: "arrow.up.arrow.down",
                    },
                    items: [
                      {
                        type: "action",
                        label: "hoge",
                        onPress: () => {
                          // Do something
                        },
                      },
                      {
                        type: "action",
                        label: "fuga",
                        onPress: () => {
                          // Do something
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }}
      />
      <EntryListView searchText={searchText} />
    </>
  );
}
