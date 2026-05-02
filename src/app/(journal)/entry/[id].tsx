import { Stack, useLocalSearchParams } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { ENTRIES } from "@/mocks/entries";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = ENTRIES.find((entry) => entry.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: entry?.title,
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
      {/* <View style={{ flex: 1 }}>
        <Host
          style={{
            flex: 1,
            backgroundColor: PlatformColor("systemBackground"),
          }}
          useViewportSizeMeasurement
        >
          <Text>Entry Detail</Text>
        </Host>
      </View> */}
      <EntryListView />
    </>
  );
}
