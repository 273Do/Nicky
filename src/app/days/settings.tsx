import { PlatformColor } from "react-native";

import { HStack, Host, List, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { foregroundStyle, frame, padding } from "@expo/ui/swift-ui/modifiers";

/**
 * Nicky 設定画面
 */
export default function SettingsScreen() {
  return (
    <Host
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      useViewportSizeMeasurement
    >
      <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
        <Section>
          <HStack>
            <Text>Language</Text>
            <Spacer />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
              日本語
            </Text>
          </HStack>
          <HStack>
            <Text>Model</Text>
            <Spacer />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
              Gemma 3 4B
            </Text>
          </HStack>
          <HStack>
            <Text>Categories</Text>
            <Spacer />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
              2
            </Text>
          </HStack>
        </Section>

        <Section>
          <HStack>
            <Text>Daily Reminder</Text>
            <Spacer />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
              21:00
            </Text>
          </HStack>
          <HStack>
            <Text>Reflection Ready</Text>
            <Spacer />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
              On
            </Text>
          </HStack>
        </Section>

        <Section>
          <Text>Export Entries</Text>
          <Text>Import Entries</Text>
          <Text modifiers={[foregroundStyle(PlatformColor("systemRed"))]}>Delete All Data</Text>
        </Section>

        <Section footer={<Text modifiers={[padding({ bottom: 10 })]}>Nicky Version 1.0.0</Text>}>
          <Text>利用規約</Text>
          <Text>プライバシーポリシー</Text>
          <Text>謝辞</Text>
        </Section>
      </List>
    </Host>
  );
}
