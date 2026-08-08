import { useState } from "react";
import { PlatformColor, Text, View } from "react-native";

import {
  Button,
  Host,
  HStack,
  Image,
  List,
  Section,
  Spacer,
  Text as SText,
} from "@expo/ui/swift-ui";
import { animation, Animation, font, foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getEntriesByDateQuery } from "@/db/queries/entries";
import { formatTime } from "@/utils/date";
import { deserializeValue } from "@/utils/entry/use-entry";

import { EntryFieldItem } from "../entry/entry-field-item";

const PREVIEW_COUNT = 2;

type Props = {
  date: Date;
};

/**
 * Days画面 — 指定日のエントリー一覧をスクロール表示
 */
export function DaysView({ date }: Props) {
  const { data: entries } = useLiveQuery(getEntriesByDateQuery(date), [date.getTime()]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!entries || entries.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: PlatformColor("systemBackground"),
        }}
      >
        <Host style={{ flex: 1 }} useViewportSizeMeasurement>
          <Text style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>No entries</Text>
        </Host>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}>
      <Host style={{ flex: 1 }} useViewportSizeMeasurement>
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            animation(Animation.default, expandedIds.size),
          ]}
        >
          {entries.map((entry, index) => {
            const { id, journal, values, createdAt } = entry;

            const sorted = [...values].sort((a, b) => a.field.sortOrder - b.field.sortOrder);

            const isFirstOfJournal =
              entries.findIndex((e) => e.journal.id === journal.id) === index;

            const isExpanded = expandedIds.has(id);
            const hasMore = sorted.length > PREVIEW_COUNT;
            const visibleFields = isExpanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

            return (
              <Section
                key={id}
                header={
                  <HStack alignment="bottom">
                    {isFirstOfJournal && (
                      <HStack spacing={6}>
                        <Image systemName={journal.icon} color={journal.color} size={20} />
                        <SText
                          modifiers={[
                            font({ size: 20, weight: "bold" }),
                            foregroundStyle(PlatformColor("label")),
                          ]}
                        >
                          {journal.name}
                        </SText>
                      </HStack>
                    )}
                    <Spacer />
                    <SText modifiers={[font({ weight: "semibold" })]}>
                      {formatTime(createdAt)}
                    </SText>
                  </HStack>
                }
              >
                {visibleFields.map((v) => (
                  <EntryFieldItem
                    key={v.id}
                    field={v.field}
                    value={deserializeValue(v.value, v.field.type)}
                  />
                ))}
                {hasMore && (
                  <Button
                    label={isExpanded ? "Show less" : `Show ${sorted.length - PREVIEW_COUNT} more`}
                    systemImage={isExpanded ? "chevron.up" : "chevron.down"}
                    onPress={() => toggleExpand(id)}
                  />
                )}
              </Section>
            );
          })}
        </List>
      </Host>
    </View>
  );
}
