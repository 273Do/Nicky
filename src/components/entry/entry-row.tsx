import { PlatformColor } from "react-native";

import { Button, HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, lineLimit } from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";

import { formatDate } from "@/utils/date";
import { EntryObj } from "@/utils/journal/use-entry";

const secondary = foregroundStyle({ type: "hierarchical", style: "secondary" });

type Props = {
  /** エントリーデータ */
  entry: EntryObj;
};

/**
 * エントリー行
 */
export function EntryRow({ entry }: Props) {
  const router = useRouter();
  return (
    <Button
      modifiers={[foregroundStyle({ type: "hierarchical", style: "primary" })]}
      onPress={() => router.push(`/(journal)/entry/${entry.id}`)}
    >
      <VStack alignment="leading" spacing={4}>
        <HStack alignment="center" spacing={6}>
          <Text modifiers={[font({ size: 12 }), secondary]}>
            {formatDate(entry.date)}
          </Text>
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
    </Button>
  );
}
