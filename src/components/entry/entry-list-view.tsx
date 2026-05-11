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
import {
  buildPreviewEntry,
  groupByMonth,
  sortEntries,
} from "@/utils/entry/preview";

import { EntryRow } from "./entry-row";

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

  const previewEntries = dbEntries.map(buildPreviewEntry);

  // 検索
  const filtered = searchText
    ? previewEntries.filter(
        (e) => e.title.includes(searchText) || e.preview.includes(searchText),
      )
    : previewEntries;

  // 並び替え
  const sorted = sortEntries(filtered, sortKey);

  // 月毎にグループ分け
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
          router.push(`/(journal)/entry/create?id=${id}&name=${journalName}`)
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
