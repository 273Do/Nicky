import { useTranslation } from "react-i18next";
import { PlatformColor, Text, View } from "react-native";

import { Host, List } from "@expo/ui/swift-ui";
import { frame, listSectionSpacing, listStyle } from "@expo/ui/swift-ui/modifiers";

import { type DailyEntryObj } from "@/db/queries/entries";

import { DaysCard } from "./days-card";
import { DaysReflection } from "./days-reflection";

/** エントリーをジャーナルごとにグループ化 */
const groupByJournal = (entries: DailyEntryObj[]): [string, DailyEntryObj[]][] => {
  const map = new Map<string, DailyEntryObj[]>();
  for (const entry of entries) {
    const id = entry.journal.id;
    const group = map.get(id);
    if (group) group.push(entry);
    else map.set(id, [entry]);
  }
  return [...map.entries()];
};

type Props = {
  /** 日付 */
  date: Date;
  /** その日のエントリー（親から渡される） */
  entries?: DailyEntryObj[];
};

/**
 * Days画面 — 指定日のエントリー一覧をスクロール表示
 */
export function DaysView({ date, entries }: Props) {
  const { t } = useTranslation();

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
          <Text style={{ fontSize: 15, color: PlatformColor("secondaryLabel") }}>
            {t("entry.noEntries")}
          </Text>
        </Host>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}>
      <Host key={date.getTime()} style={{ flex: 1 }} useViewportSizeMeasurement>
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            listStyle("plain"),
            listSectionSpacing(0),
          ]}
        >
          <DaysReflection date={date} />
          {groupByJournal(entries).map(([journalId, journalEntries]) => (
            <DaysCard key={journalId} journalEntries={journalEntries} />
          ))}
        </List>
      </Host>
    </View>
  );
}
