import { PlatformColor, View } from "react-native";

import { Host, VStack } from "@expo/ui/swift-ui";

import { AllformList } from "@/components/all-form-list";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <VStack>
          <AllformList />
        </VStack>
      </Host>
    </View>
  );
}
