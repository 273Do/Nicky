import { PlatformColor, View } from "react-native";

import {
  Host,
  HStack,
  ScrollView,
  Spacer,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  fixedSize,
  font,
  foregroundStyle,
  glassEffect,
  onTapGesture,
  padding,
} from "@expo/ui/swift-ui/modifiers";

const chipBase = [padding({ vertical: 6, horizontal: 10 }), font({ size: 14 })];

const glassLabel = [
  ...chipBase,
  glassEffect({
    glass: { variant: "regular", interactive: true },
    shape: "roundedRectangle",
    cornerRadius: 100,
  }),
  foregroundStyle(PlatformColor("label")),
  foregroundStyle({ type: "hierarchical", style: "secondary" }),
];

const activeLabel = [
  ...chipBase,
  glassEffect({
    glass: {
      variant: "regular",
      interactive: true,
      tint: PlatformColor("systemIndigo"),
    },
    shape: "roundedRectangle",
    cornerRadius: 100,
  }),
];

/**
 * インサイト画面
 */
export function InsightsView() {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <VStack
          alignment="leading"
          spacing={0}
          modifiers={[padding({ top: -32 })]}
        >
          <ScrollView axes="horizontal" showsIndicators={false}>
            <HStack
              spacing={8}
              modifiers={[
                padding({ leading: 16, vertical: 32 }),
                fixedSize({ horizontal: true, vertical: false }),
              ]}
            >
              <Text modifiers={[...activeLabel, onTapGesture(() => {})]}>
                journal title
              </Text>
              <Text modifiers={[...glassLabel, onTapGesture(() => {})]}>
                journal title
              </Text>
              <Text modifiers={[...glassLabel, onTapGesture(() => {})]}>
                journal title
              </Text>
              <Text modifiers={[...glassLabel, onTapGesture(() => {})]}>
                journal title
              </Text>
              <Text modifiers={[...glassLabel, onTapGesture(() => {})]}>
                journal title
              </Text>
              <Text modifiers={[...glassLabel, onTapGesture(() => {})]}>
                journal title
              </Text>
              <Text modifiers={[...glassLabel, onTapGesture(() => {})]}>
                journal title
              </Text>
            </HStack>
          </ScrollView>
          <Text>aa</Text>
          <Spacer />
        </VStack>
      </Host>
    </View>
  );
}
