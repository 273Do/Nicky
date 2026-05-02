import { PlatformColor } from "react-native";

import { HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, lineLimit } from "@expo/ui/swift-ui/modifiers";

import { Entry } from "@/mocks/entries";

const secondary = foregroundStyle({ type: "hierarchical", style: "secondary" });

export const EntryRow = ({ entry }: { entry: Entry }) => (
  <VStack alignment="leading" spacing={4}>
    <HStack alignment="center" spacing={6}>
      <Text modifiers={[font({ size: 12 }), secondary]}>{entry.date}</Text>
      <Spacer />
      {entry.bookmark && (
        <Image
          systemName="bookmark.fill"
          size={12}
          color={PlatformColor("systemIndigo")}
        />
      )}
    </HStack>
    <Text modifiers={[font({ size: 16, weight: "bold" })]}>{entry.title}</Text>
    <Text modifiers={[font({ size: 14 }), secondary, lineLimit(2)]}>
      {entry.preview}
    </Text>
  </VStack>
);
