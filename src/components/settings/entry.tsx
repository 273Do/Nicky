import { PlatformColor } from "react-native";

import { Button, Section, Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";

export function EntrySettings() {
  return (
    <Section>
      <Button>
        <Text modifiers={[foregroundStyle(PlatformColor("systemIndigo"))]}>
          Export All Journals
        </Text>
      </Button>
      <Button>
        <Text modifiers={[foregroundStyle(PlatformColor("systemIndigo"))]}>Export All Entries</Text>
      </Button>
      <Button>
        <Text modifiers={[foregroundStyle(PlatformColor("systemRed"))]}>Delete All Data</Text>
      </Button>
    </Section>
  );
}
