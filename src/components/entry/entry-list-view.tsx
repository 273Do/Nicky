import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlatformColor, Pressable, StyleSheet, View } from "react-native";

import { Host, Image, List, Section, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  animation,
  Animation,
  font,
  foregroundStyle,
  frame,
  listStyle,
  onTapGesture,
  opacity,
  padding,
} from "@expo/ui/swift-ui/modifiers";
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
  /** ローカル認証未通過でロック中 */
  locked?: boolean;
  /** ロック解除コールバック */
  onUnlock?: () => void;
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
  locked = false,
  onUnlock,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const { id: activeJournalId, name: activeJournalName, oneEntry } = activeJournal;

  const { entries } = useEntryList({
    journalId: activeJournalId,
    bookmarkOnly,
  });

  const fadeKey = `${activeJournalId}:${String(bookmarkOnly)}`;
  const [prevFadeKey, setPrevFadeKey] = useState(fadeKey);
  const [fade, setFade] = useState(1);

  if (fadeKey !== prevFadeKey) {
    setPrevFadeKey(fadeKey);
    setFade(0.25);
  }

  useEffect(() => {
    if (fade < 1) {
      const id = requestAnimationFrame(() => setFade(1));
      return () => cancelAnimationFrame(id);
    }
  }, [fade]);

  const todayStart = startOfDay();
  const hasTodayEntry = entries.some((e) => e.createdAt >= todayStart);
  const disabled = oneEntry && hasTodayEntry;

  const chipList =
    journals && onSelectJournal ? (
      <JournalChipList
        key={chipScrollKey}
        journals={journals}
        activeJournalId={activeJournalId}
        onSelect={onSelectJournal}
        scrollToEnd={chipScrollKey > 0}
      />
    ) : undefined;

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        {locked ? (
          <VStack modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
            {chipList}
            <Spacer />
            <Image systemName="lock.fill" color={PlatformColor("secondaryLabel")} size={42} />
            <Text
              modifiers={[
                font({ size: 14, weight: "semibold" }),
                foregroundStyle(PlatformColor("label")),
                padding({ top: 4, bottom: 8 }),
              ]}
            >
              {t("journal.lockedMessage")}
            </Text>
            <Text
              modifiers={[
                font({ size: 14 }),
                foregroundStyle(PlatformColor("systemIndigo")),
                onTapGesture(onUnlock ?? (() => {})),
              ]}
            >
              {t("journal.unlockButton")}
            </Text>
            <Spacer />
          </VStack>
        ) : (
          <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 }), listStyle("plain")]}>
            <Section header={chipList}>
              <List.ForEach
                onDelete={(indices) =>
                  indices.forEach(async (i) => await deleteEntry(entries[i].id))
                }
                modifiers={[opacity(fade), animation(Animation.easeInOut({ duration: 0.1 }), fade)]}
              >
                {entries.map((entry) => (
                  <EntryRow key={entry.id} journalName={activeJournalName} entry={entry} />
                ))}
              </List.ForEach>
            </Section>
          </List>
        )}
      </Host>

      {!disabled && !locked && (
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
