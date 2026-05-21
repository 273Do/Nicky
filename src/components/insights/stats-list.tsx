import { Text } from "@expo/ui/swift-ui";
import { font, listRowSeparator, padding } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getEntriesQuery } from "@/db/queries/entries";
import { getFieldsQuery } from "@/db/queries/fields";

import { StatFieldItem } from "./stat-filed-item";
import { WeeklySummaryCard } from "./weekly-summary-card";

type Props = {
  /** アクティブなジャーナル id */
  activeJournalId: string;
  /** アクセントカラー */
  accentColor: string;
};

/**
 * ステータリスト
 */
export function StatsList({ activeJournalId, accentColor }: Props) {
  const { data: fields } = useLiveQuery(getFieldsQuery(activeJournalId), [
    activeJournalId,
  ]);

  const { data: entries } = useLiveQuery(getEntriesQuery(activeJournalId), [
    activeJournalId,
  ]);

  console.log(entries);
  console.log(fields);

  return (
    <>
      <Text
        modifiers={[
          padding({ leading: 16, bottom: -16 }),
          font({ size: 24, weight: "semibold" }),
          listRowSeparator("hidden"),
        ]}
      >
        Last 7 Days
      </Text>
      <WeeklySummaryCard accentColor={accentColor} entries={entries} />
      <Text
        modifiers={[
          padding({ leading: 16, bottom: -16 }),
          font({ size: 24, weight: "semibold" }),
          listRowSeparator("hidden"),
        ]}
      >
        Field Stats
      </Text>
      {fields.map((field) => (
        <StatFieldItem
          key={field.id}
          field={field}
          accentColor={accentColor}
          entries={entries}
        />
      ))}
    </>
  );
}
