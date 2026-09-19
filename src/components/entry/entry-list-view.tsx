import { useEffect, useState } from "react";
import { PlatformColor, Pressable, StyleSheet, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { animation, Animation, frame, listStyle, opacity } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { JournalChipList } from "@/components/journal/journal-chip";
import { deleteEntry } from "@/db/queries/entries";
import { type JournalWithCountObj } from "@/db/queries/journals";
import { useEntryList } from "@/hooks/entry/use-entry-list";
import { startOfDay } from "@/utils/date";

import { EntryRow } from "./entry-row";

type Props = {
  /** ジャーナル一覧（チップリスト表示時に必要） */
  journals?: JournalWithCountObj[];
  /** 選択中のジャーナル */
  activeJournal: JournalWithCountObj;
  /** ジャーナル切り替え（チップリスト表示時に必要） */
  onSelectJournal?: (id: string) => void;
  /** ブックマークのみ表示 */
  bookmarkOnly?: boolean;
  /** チップリストの再マウント用キー（作成後にスクロール位置をリセット） */
  chipScrollKey?: number;
};

/**
 * エントリー一覧画面（JournalChipList + エントリーリスト）
 */
export function EntryListView({
  journals,
  activeJournal,
  onSelectJournal,
  bookmarkOnly = false,
  chipScrollKey = 0,
}: Props) {
  const router = useRouter();

  const { id: activeJournalId, name: activeJournalName, oneEntry } = activeJournal;

  const { entries } = useEntryList({
    journalId: activeJournalId,
    bookmarkOnly,
  });

  const [fade, setFade] = useState(1);

  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      setFade(0.25);
      id2 = requestAnimationFrame(() => setFade(1));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [activeJournalId, bookmarkOnly]);

  const todayStart = startOfDay();
  const hasTodayEntry = entries.some((e) => e.createdAt >= todayStart);
  const disabled = oneEntry && hasTodayEntry;

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 }), listStyle("plain")]}>
          <Section
            header={
              journals && onSelectJournal ? (
                <JournalChipList
                  key={chipScrollKey}
                  journals={journals}
                  activeJournalId={activeJournalId}
                  onSelect={onSelectJournal}
                  scrollToEnd={chipScrollKey > 0}
                />
              ) : undefined
            }
          >
            <List.ForEach
              onDelete={(indices) => indices.forEach(async (i) => await deleteEntry(entries[i].id))}
              modifiers={[opacity(fade), animation(Animation.easeInOut({ duration: 0.1 }), fade)]}
            >
              {entries.map((entry) => (
                <EntryRow key={entry.id} journalName={activeJournalName} entry={entry} />
              ))}
            </List.ForEach>
          </Section>
        </List>
      </Host>

      {!disabled && (
        <Pressable
          onPress={() =>
            router.push(
              `/(journal)/entry/create?journalId=${activeJournalId}&journalName=${activeJournalName}`,
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 102,
    right: 22,
  },
  fabDisabled: {
    opacity: 0.3,
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
