import { PlatformColor, Pressable, View, useColorScheme } from "react-native";

import { Host } from "@expo/ui/swift-ui";
import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import JournalList from "@/components/journal/journal-list";

/**
 * ジャーナル画面
 */
export default function JournalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Journal",
          headerTitleStyle: {
            color: titleColor,
          },
          headerShown: true,
          headerLargeTitleEnabled: true,
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <Pressable onPress={() => router.push("/(journal)/template")}>
              <SymbolView
                name="plus"
                size={22}
                tintColor={PlatformColor("label")}
              />
            </Pressable>
          ),
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
          <JournalList />
        </Host>
      </View>
    </>
  );
}
