import { PlatformColor } from "react-native";

import { HStack, Image, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import { type DailyEntryObj } from "@/db/queries/entries";
import { buildPreviewEntry } from "@/utils/entry/preview";

import { EntryRow } from "../entry/entry-row";

type Props = {
  journalEntries: DailyEntryObj[];
};

/**
 * Days画面 — ジャーナル単位のタイムラインセクション
 */
export function DaysCard({ journalEntries }: Props) {
  const { journal } = journalEntries[0];

  return (
    <Section
      header={
        <HStack spacing={6}>
          <Image systemName={journal.icon} color={journal.color} size={20} />
          <Text
            modifiers={[
              font({ size: 20, weight: "bold" }),
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
      {journalEntries.map((entry) => (
        <EntryRow key={entry.id} journalName={journal.name} entry={buildPreviewEntry(entry)} />
      ))}
    </Section>
  );
}
