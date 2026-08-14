import { HStack, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";

export function System() {
  return (
    <Section>
      <HStack>
        <Text>Language</Text>
        <Spacer />
        <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
          日本語
        </Text>
      </HStack>
      <HStack>
        <Text>外観</Text>
        <Spacer />
        <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
          システム
        </Text>
      </HStack>
    </Section>
  );
}
