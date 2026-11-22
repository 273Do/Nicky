import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { Host, Image, List, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  listStyle,
  multilineTextAlignment,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { DaysCard } from "@/components/days/days-card";
import { type DailyEntryObj } from "@/db/queries/entries";

/** エントリーをジャーナルごとにグループ化 */
const groupByJournal = (entries: DailyEntryObj[]): [string, DailyEntryObj[]][] => {
  const map = new Map<string, DailyEntryObj[]>();
  for (const entry of entries) {
    const group = map.get(entry.journal.id);
    if (group) group.push(entry);
    else map.set(entry.journal.id, [entry]);
  }
  return [...map.entries()];
};

type Props = {
  /** 検索キーワード */
  query: string;
  /** 検索結果 */
  results: DailyEntryObj[];
};

/**
 * 検索結果一覧
 */
export function SearchResultsView({ query, results }: Props) {
  const { t } = useTranslation();
  const trimmed = query.trim();

  return (
    <Host
      style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
      useViewportSizeMeasurement
    >
      {trimmed && results.length === 0 ? (
        <VStack modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
          <Spacer />
          <Image systemName="magnifyingglass" color={PlatformColor("secondaryLabel")} size={42} />
          <Text
            modifiers={[
              font({ size: 18, weight: "semibold" }),
              foregroundStyle(PlatformColor("label")),
              padding({ top: 4, bottom: 2 }),
            ]}
          >
            {t("search.noResults", { query: trimmed })}
          </Text>
          <Text
            modifiers={[
              font({ size: 16 }),
              foregroundStyle(PlatformColor("secondaryLabel")),
              multilineTextAlignment("center"),
              padding({ horizontal: 32 }),
            ]}
          >
            {t("search.noResultsDesc")}
          </Text>
          <Spacer />
        </VStack>
      ) : (
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 }), listStyle("plain")]}>
          {groupByJournal(results).map(([journalId, journalEntries]) => (
            <DaysCard key={journalId} journalEntries={journalEntries} basePath="/search/entry" />
          ))}
        </List>
      )}
    </Host>
  );
}
