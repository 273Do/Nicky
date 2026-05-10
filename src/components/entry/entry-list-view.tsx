import { PlatformColor, Pressable, StyleSheet, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import {
  frame,
  headerProminence,
  moveDisabled,
} from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import type { SortKey } from "@/app/(journal)/[id]";
import { getEntriesQuery } from "@/db/queries/entries";
import { formatYearMonth } from "@/utils/date";
import { EntryObj } from "@/utils/journal/use-entry";

import { EntryRow } from "./entry-row";

function sortEntries(entries: EntryObj[], sortKey: SortKey): EntryObj[] {
  switch (sortKey) {
    case "dateDesc":
      return [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
    case "dateAsc":
      return [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
    case "titleAsc":
      return [...entries].sort((a, b) => a.title.localeCompare(b.title));
    case "titleDesc":
      return [...entries].sort((a, b) => b.title.localeCompare(a.title));
    case "bookmark":
      return [...entries].sort(
        (a, b) => (b.bookmark ? 1 : 0) - (a.bookmark ? 1 : 0),
      );
  }
}

function groupByMonth(
  entries: EntryObj[],
): { month: string; entries: EntryObj[] }[] {
  const map = new Map<string, EntryObj[]>();
  for (const entry of entries) {
    const key = `${entry.date.getFullYear()}-${entry.date.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries()).map(([, entries]) => ({
    month: formatYearMonth(entries[0].date),
    entries,
  }));
}

type Props = {
  /** ジャーナル id */
  id: string;
  /** ジャーナル */
  journalName: string;
  /** 検索テキスト */
  searchText?: string;
  /** ソートキー */
  sortKey?: SortKey;
};

/**
 * エントリー一覧画面
 */
export function EntryListView({
  id,
  journalName,
  searchText = "",
  sortKey = "dateDesc",
}: Props) {
  const router = useRouter();

  const { data: dbEntries } = useLiveQuery(getEntriesQuery(id));

  const entries: EntryObj[] = (dbEntries ?? []).map((entry) => ({
    id: entry.id,
    date: new Date(entry.createdAt),
    title: entry.values[0]?.value ?? "",
    preview: entry.values
      .slice(1)
      .map((v) => v.value)
      .join(" "),
    bookmark: entry.bookmark,
  }));

  const filtered = searchText
    ? entries.filter(
        (e) => e.title.includes(searchText) || e.preview.includes(searchText),
      )
    : entries;
  const sorted = sortEntries(filtered, sortKey);
  const grouped = groupByMonth(sorted);

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
          <List.ForEach modifiers={[moveDisabled()]}>
            {grouped.map(({ month, entries }) => (
              <Section
                key={month}
                title={month}
                modifiers={[headerProminence("increased")]}
              >
                {entries.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </Section>
            ))}
          </List.ForEach>
        </List>
      </Host>

      <Pressable
        onPress={() =>
          router.push(`/(journal)/entry/create?name=${journalName}`)
        }
        style={styles.fab}
      >
        <GlassView
          glassEffectStyle="regular"
          tintColor={PlatformColor("systemGra1y3") as unknown as string}
          style={styles.glassButton}
        >
          <SymbolView name="plus" tintColor={PlatformColor("label")} />
        </GlassView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 102,
    right: 16,
  },
  glassButton: {
    width: 62,
    height: 62,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
});
