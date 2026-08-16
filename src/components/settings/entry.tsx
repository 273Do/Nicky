import { Button, Section, Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";

const primaryStyle = foregroundStyle({ type: "hierarchical", style: "primary" });

export function EntrySettings() {
  return (
    <Section>
      <Button modifiers={[primaryStyle]}>
        <Text>Export All Journals</Text>
      </Button>
      <Button modifiers={[primaryStyle]}>
        <Text>Export All Entries</Text>
      </Button>
      <Button role="destructive" modifiers={[primaryStyle]}>
        <Text>Delete All Data</Text>
      </Button>
    </Section>
  );
}
