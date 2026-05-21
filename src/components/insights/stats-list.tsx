import { Text } from "@expo/ui/swift-ui";
import { font, listRowSeparator, padding } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getEntriesQuery } from "@/db/queries/entries";
import { getFieldsQuery } from "@/db/queries/fields";

import { StatCard } from "./stat-card";
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

  const entryTimestamps = entries.map((e) => e.createdAt);

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
      <WeeklySummaryCard
        timestamps={entryTimestamps}
        accentColor={accentColor}
      />
      <Text
        modifiers={[
          padding({ leading: 16, bottom: -16 }),
          font({ size: 24, weight: "semibold" }),
          listRowSeparator("hidden"),
        ]}
      >
        Field Stats
      </Text>
      <StatCard
        label="Total Entries"
        value="100"
        unit="entries"
        fieldType={"number"}
        accentColor={accentColor}
      />
      <StatCard
        label="This Week"
        value="7"
        unit="entries"
        fieldType={"text"}
        accentColor={accentColor}
      />
      <StatCard
        label="Streak"
        value="5"
        unit="days"
        fieldType={"date"}
        accentColor={accentColor}
      />
      <StatCard
        label="Weekly Avg"
        value="4.2"
        unit="entries"
        fieldType={"check"}
        accentColor={accentColor}
      />
    </>
  );
}
