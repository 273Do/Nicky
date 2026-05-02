import { useColorScheme } from "react-native";

import { Stack, useLocalSearchParams } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { JOURNALS } from "@/mocks/journals";

/**
 * ジャーナル一覧
 */
export default function JournalScreen() {
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";
  const { id } = useLocalSearchParams<{ id: string }>();

  const journal = JOURNALS.find((journal) => journal.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: journal?.name,
          headerTitleStyle: {
            color: titleColor,
          },
          headerShown: true,
          headerLargeTitleEnabled: true,
          headerBackButtonDisplayMode: "minimal",
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
      <EntryListView />
    </>
  );
}
