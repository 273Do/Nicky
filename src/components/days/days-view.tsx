import { useState } from "react";
import { PlatformColor, Text, View } from "react-native";

import { Host, List } from "@expo/ui/swift-ui";
import { animation, Animation, frame } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getEntriesByDateQuery } from "@/db/queries/entries";

import { DaysCard } from "./days-card";
import { DaysLLMFB } from "./days-llm-fb";

type Props = {
  /**
   * 日付
   */
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
          backgroundColor: PlatformColor("systemGroupedBackground"),
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
          <DaysLLMFB entries={entries} />
          {entries.map((entry, index) => (
            <DaysCard
              key={entry.id}
              entry={entry}
              isFirstOfJournal={
                entries.findIndex((e) => e.journal.id === entry.journal.id) === index
              }
              isExpanded={expandedIds.has(entry.id)}
              onToggleExpand={() => toggleExpand(entry.id)}
            />
          ))}
        </List>
      </Host>
    </View>
  );
}
