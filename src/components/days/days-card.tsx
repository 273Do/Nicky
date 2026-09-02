import { PlatformColor } from "react-native";

import { Button, HStack, Image, Rectangle, Section, Spacer, Text } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  lineLimit,
  listRowSeparator,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";

import { type DailyEntryObj } from "@/db/queries/entries";
import { formatTime } from "@/utils/date";
import { buildPreviewEntry } from "@/utils/entry/preview";

import { secondary } from "../entry/entry-row";

type Props = {
  journalEntries: DailyEntryObj[];
};

/**
 * Days画面 — ジャーナル単位のタイムラインセクション
 */
export function DaysCard({ journalEntries }: Props) {
  const router = useRouter();

  const { journal } = journalEntries[0];

  return (
    <Section
      header={
        <HStack spacing={6}>
          <Image systemName={journal.icon} color={journal.color} size={16} />
          <Text
            modifiers={[
              font({ size: 16, weight: "bold" }),
              foregroundStyle(PlatformColor("label")),
            ]}
          >
            {journal.name}
          </Text>
          <Spacer />
          <Text modifiers={[foregroundStyle(PlatformColor("secondary"))]}>
            {journalEntries.length > 1 && journalEntries.length}
          </Text>
        </HStack>
      }
    >
      {journalEntries.map((entry) => {
        const preview = buildPreviewEntry(entry);
        return (
          <Button
            key={entry.id}
            modifiers={[
              foregroundStyle({ type: "hierarchical", style: "primary" }),
              listRowSeparator("hidden"),
            ]}
            onPress={() => router.push(`/days/entry/${entry.id}?journalName=${journal.name}`)}
          >
            <HStack spacing={15} modifiers={[padding({ vertical: -5, leading: 10 })]}>
              {/* 縦線 */}
              <Rectangle
                modifiers={[
                  frame({ width: 1.5, maxHeight: 9999 }),
                  foregroundStyle(PlatformColor("separator")),
                ]}
              />
              <Text modifiers={[font({ size: 16 }), lineLimit(1)]}>{preview.title}</Text>
              <Spacer />
              <Text modifiers={[secondary]}>{formatTime(entry.createdAt)}</Text>
            </HStack>
          </Button>
        );
      })}
    </Section>
  );
}
