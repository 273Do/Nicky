import { PlatformColor } from "react-native";

import { Button, HStack, Image, Section, Spacer, Text as SText, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, listRowSeparator, opacity } from "@expo/ui/swift-ui/modifiers";

import { EntryDetailObj } from "@/db/queries/entries";
import { JournalObj } from "@/db/schemas";
import { formatTime } from "@/utils/date";
import { deserializeValue } from "@/utils/entry/use-entry";

import { EntryFieldItem } from "../entry/entry-field-item";

const PREVIEW_COUNT = 2;

type Props = {
  entry: EntryDetailObj & { journal: JournalObj };
  isFirstOfJournal: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

/**
 * Days画面のエントリーカード
 */
export function DaysCard({ entry, isFirstOfJournal, isExpanded, onToggleExpand }: Props) {
  const { journal, values, createdAt } = entry;
  const sorted = [...values].sort((a, b) => a.field.sortOrder - b.field.sortOrder);
  const hasMore = sorted.length > PREVIEW_COUNT;
  const visibleFields = isExpanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

  return (
    <Section
      header={
        <HStack alignment="bottom">
          {isFirstOfJournal && (
            <HStack spacing={6}>
              <Image systemName={journal.icon} color={journal.color} size={20} />
              <SText
                modifiers={[
                  font({ size: 18, weight: "bold" }),
                  foregroundStyle(PlatformColor("label")),
                ]}
              >
                {journal.name}
              </SText>
            </HStack>
          )}
          <Spacer />
          <SText modifiers={[font({ weight: "semibold" })]}>{formatTime(createdAt)}</SText>
        </HStack>
      }
    >
      {visibleFields.map((v, i) => {
        const isFading = !isExpanded && hasMore && i === visibleFields.length - 1;
        if (isFading) {
          return (
            <VStack key={v.id} modifiers={[opacity(0.3), listRowSeparator("hidden", "bottom")]}>
              <EntryFieldItem field={v.field} value={deserializeValue(v.value, v.field.type)} />
            </VStack>
          );
        }
        return (
          <EntryFieldItem
            key={v.id}
            field={v.field}
            value={deserializeValue(v.value, v.field.type)}
          />
        );
      })}
      {hasMore && (
        <Button
          label={isExpanded ? "Show less" : `Show ${sorted.length - PREVIEW_COUNT} more`}
          systemImage={isExpanded ? "chevron.up" : "chevron.down"}
          onPress={onToggleExpand}
        />
      )}
    </Section>
  );
}
