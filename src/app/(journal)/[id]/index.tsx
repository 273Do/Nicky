import { useColorScheme } from "react-native";

import { Stack, useLocalSearchParams } from "expo-router";

import { JournalListView } from "@/components/journal/journal-list-view";

/**
 * ジャーナル一覧画面
 */
export default function JournalScreen() {
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Journal Title ${id}`,
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
      <JournalListView />
    </>
  );
}
