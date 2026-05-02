import { PlatformColor, useColorScheme, View } from "react-native";

import { Host, Text } from "@expo/ui/swift-ui";
import { Stack, useLocalSearchParams } from "expo-router";

import { ENTRIES } from "@/mocks/entries";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = ENTRIES.find((entry) => entry.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: entry?.title,
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
      <View style={{ flex: 1 }}>
        <Host
          style={{
            flex: 1,
            backgroundColor: PlatformColor("systemBackground"),
          }}
          useViewportSizeMeasurement
        >
          <Text>Entry Detail</Text>
        </Host>
      </View>
    </>
  );
}
