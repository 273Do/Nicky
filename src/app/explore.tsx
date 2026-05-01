import { PlatformColor, View } from "react-native";

import { Host, Text } from "@expo/ui/swift-ui";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <Text>Explore</Text>
      </Host>
    </View>
  );
}
