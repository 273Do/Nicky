import { PlatformColor, Pressable, StyleSheet, View } from "react-native";

import { Host, List, Section, Text } from "@expo/ui/swift-ui";
import { font, frame, listStyle, padding } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { JournalChipList } from "@/components/insights/journal-chip";
import { deleteEntry } from "@/db/queries/entries";
import { type JournalWithCountObj } from "@/db/queries/journals";
import { type SortKey } from "@/utils/entry/consts";
import { useEntryList } from "@/utils/entry/use-entry-list";

import { EntryRow } from "./entry-row";

type Props = {
  /** ジャーナル一覧（チップリスト表示時に必要） */
  journals?: JournalWithCountObj[];
  /** 選択中のジャーナル id */
  activeJournalId: string;
  /** ジャーナル切り替え（チップリスト表示時に必要） */
  onSelectJournal?: (id: string) => void;
  /** ジャーナル名 */
  journalName: string;
  /** 検索テキスト */
  searchText?: string;
  /** ソートキー */
  sortKey?: SortKey;
};

/**
 * エントリー一覧画面（JournalChipList + エントリーリスト）
 */
export function EntryListView({
  journals,
  activeJournalId,
  onSelectJournal,
  journalName,
  searchText = "",
  sortKey = "dateDesc",
}: Props) {
  const router = useRouter();

  const { grouped } = useEntryList({
    journalId: activeJournalId,
    searchText,
    sortKey,
  });

  return (
    <View style={{ flex: 1 }}>
      <Host style={{ flex: 1 }} useViewportSizeMeasurement>
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            listStyle("plain"),
          ]}
        >
          <Section
            header={
              journals && onSelectJournal ? (
                <JournalChipList
                  journals={journals}
                  activeJournalId={activeJournalId}
                  onSelect={onSelectJournal}
                />
              ) : undefined
            }
          >
            {grouped.map(({ month, previewEntries }) => (
              <Section
                key={month}
                header={
                  <Text
                    modifiers={[
                      font({ size: 20, weight: "bold" }),
                      padding({ bottom: 4 }),
                    ]}
                  >
                    {month}
                  </Text>
                }
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
          </Section>
        </List>
      </Host>

      <Pressable
        onPress={() =>
          router.push(
            `/(journal)/entry/create?journalId=${activeJournalId}&journalName=${journalName}`,
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
