import { PlatformColor, View } from "react-native";

import { Host, Text } from "@expo/ui/swift-ui";
import { font, padding } from "@expo/ui/swift-ui/modifiers";

/**
 * ジャーナル作成画面
 */
export function JournalCreateView() {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <Text
          modifiers={[
            font({ size: 28, weight: "bold" }),
            padding({ bottom: 8 }),
          ]}
        >
          ジャーナル作成
        </Text>
      </Host>
    </View>
  );
}
