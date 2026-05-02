import { PlatformColor } from "react-native";

import { HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  lineLimit,
  onTapGesture,
} from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";

import { Entry } from "@/mocks/entries";

const secondary = foregroundStyle({ type: "hierarchical", style: "secondary" });

/**
 * エントリー行
 */
export function EntryRow({ entry }: { entry: Entry }) {
  const router = useRouter();
  return (
    <VStack
      alignment="leading"
      spacing={4}
      modifiers={[
        onTapGesture(() => router.push(`/(journal)/entry/${entry.id}`)),
      ]}
    >
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
      <Text modifiers={[font({ size: 16, weight: "bold" })]}>
        {entry.title}
      </Text>
      <Text modifiers={[font({ size: 14 }), secondary, lineLimit(2)]}>
        {entry.preview}
      </Text>
    </VStack>
  );
}
