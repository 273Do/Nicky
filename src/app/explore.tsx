import { PlatformColor, View } from "react-native";

import { Host, VStack } from "@expo/ui/swift-ui";

import { AllformList } from "@/components/all-form-list";
import ChartDemo from "@/components/chart-demo";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <VStack>
          <AllformList />
          <ChartDemo />
        </VStack>
      </Host>
    </View>
  );
}
