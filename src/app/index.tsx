import { PlatformColor, View } from "react-native";

import { Host } from "@expo/ui/swift-ui";

import JournalList from "@/components/journal/journal-list";

export default function JournalScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <JournalList />
      </Host>
    </View>
  );
}
