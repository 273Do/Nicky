import { PlatformColor, Pressable, StyleSheet, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { frame, listStyle } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { JournalChipList } from "@/components/journal/journal-chip";
import { deleteEntry } from "@/db/queries/entries";
import { type JournalWithCountObj } from "@/db/queries/journals";
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
  /** ブックマークのみ表示 */
  bookmarkOnly?: boolean;
};

/**
 * エントリー一覧画面（JournalChipList + エントリーリスト）
 */
export function EntryListView({
  journals,
  activeJournalId,
  onSelectJournal,
  journalName,
  bookmarkOnly = false,
}: Props) {
  const router = useRouter();

  const { entries } = useEntryList({
    journalId: activeJournalId,
    bookmarkOnly,
  });

  return (
    <View style={{ flex: 1 }}>
      <Host style={{ flex: 1 }} useViewportSizeMeasurement>
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 }), listStyle("plain")]}>
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
            <List.ForEach
              onDelete={(indices) => indices.forEach(async (i) => await deleteEntry(entries[i].id))}
            >
              {entries.map((entry) => (
                <EntryRow key={entry.id} journalName={journalName} entry={entry} />
              ))}
            </List.ForEach>
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
    right: 22,
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
