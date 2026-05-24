import { PlatformColor, Pressable, StyleSheet, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { frame, headerProminence } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { deleteEntry } from "@/db/queries/entries";
import { type SortKey } from "@/utils/entry/consts";
import { useEntryList } from "@/utils/entry/use-entry-list";

import { EntryRow } from "./entry-row";

type Props = {
  /** ジャーナル id */
  journalId: string;
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
  journalId,
  journalName,
  searchText = "",
  sortKey = "dateDesc",
}: Props) {
  const router = useRouter();

  const { grouped } = useEntryList({ journalId, searchText, sortKey });

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
          {grouped.map(({ month, previewEntries }) => (
            <Section
              key={month}
              title={month}
              modifiers={[headerProminence("increased")]}
            >
              <List.ForEach
                onDelete={(indices) =>
                  indices.forEach(
                    async (i) => await deleteEntry(previewEntries[i].id),
                  )
                }
              >
                {previewEntries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    journalName={journalName}
                    entry={entry}
                  />
                ))}
              </List.ForEach>
            </Section>
          ))}
        </List>
      </Host>

      <Pressable
        onPress={() =>
          router.push(
            `/(journal)/entry/create?journalId=${journalId}&journalName=${journalName}`,
          )
        }
        style={styles.fab}
      >
        <GlassView
          glassEffectStyle="regular"
          tintColor={PlatformColor("systemGray3").toString()}
          isInteractive
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
