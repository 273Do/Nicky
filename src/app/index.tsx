import { PlatformColor, View } from "react-native";

import { Host } from "@expo/ui/swift-ui";

import JournalsScreen from "@/components/screens/journals";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <JournalsScreen />
      </Host>
    </View>
  );
}
