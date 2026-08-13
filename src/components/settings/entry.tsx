import { PlatformColor } from "react-native";

import { Section, Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";

export function EntrySettings() {
  return (
    <Section>
      <Text>Export Entries</Text>
      <Text>Import Entries</Text>
      <Text modifiers={[foregroundStyle(PlatformColor("systemRed"))]}>Delete All Data</Text>
    </Section>
  );
}
