import { PlatformColor, useColorScheme, View } from "react-native";

import { Host, Text } from "@expo/ui/swift-ui";
import { font, padding } from "@expo/ui/swift-ui/modifiers";
import { Stack, useLocalSearchParams } from "expo-router";

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
      <View style={{ flex: 1 }}>
        <Host
          style={{
            flex: 1,
            backgroundColor: PlatformColor("systemBackground"),
          }}
          useViewportSizeMeasurement
        >
          <Text
            modifiers={[
              font({ size: 28, weight: "bold" }),
              padding({ bottom: 8 }),
            ]}
          >
            ジャーナル
          </Text>
        </Host>
      </View>
    </>
  );
}
