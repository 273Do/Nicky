import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

import { Alert, Button, Host, Text } from "@expo/ui/swift-ui";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useFocusEffect, useRouter } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { FREE_JOURNAL_LIMIT } from "@/constants/purchases";
import { db } from "@/db/client";
import { deleteAllEntries } from "@/db/queries/entries";
import { getJournalsQuery, JournalWithCountObj } from "@/db/queries/journals";
import { settings } from "@/db/schemas";
import { useProGate } from "@/hooks/purchases/use-pro-gate";
import { exportJournalEntries } from "@/utils/entry/export-entry";
import { consumeCreatedJournalId } from "@/utils/journal/created-journal";
import { authenticate } from "@/utils/local-auth";

/**
 * ジャーナル画面（チップ切り替え + エントリー一覧）
 */
export default function JournalScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const appIcon =
    colorScheme === "dark"
      ? require("@/assets/images/nav-icon-dark.png")
      : require("@/assets/images/nav-icon.png");

  const onboardingNavigated = useRef(false);

  useEffect(() => {
    if (onboardingNavigated.current) return;
    const rows = db.select().from(settings).where(eq(settings.key, "onboarding_completed")).get();
    if (!rows || rows.value !== "true") {
      onboardingNavigated.current = true;
      router.push("/(journal)/onboarding");
    }
  }, [router]);

  const { data: journals } = useLiveQuery(getJournalsQuery);
  const journalList: JournalWithCountObj[] = journals ?? [];

  const { isPro, openPaywall } = useProGate();
  // 無料プランのジャーナル数上限（既存データはそのまま、新規作成のみ制限する）
  const journalLimitReached = !isPro && journalList.length >= FREE_JOURNAL_LIMIT;

  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [chipScrollKey, setChipScrollKey] = useState(0);
  // ロック中ジャーナルの認証状態（認証済み ID を保持）
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  // 作成直後のフォーカス復帰時に ID を受け取る（useRef で二重消費を防ぐ）
  const consumed = useRef(false);
  useFocusEffect(() => {
    if (consumed.current) return;
    const id = consumeCreatedJournalId();
    if (id) {
      setSelectedJournalId(id);
      setChipScrollKey((k) => k + 1);
      consumed.current = true;
    }
    return () => {
      consumed.current = false;
    };
  });

  // 選択中のジャーナル（未選択 or 存在しない場合は先頭）
  const activeJournal = journalList.find((j) => j.id === selectedJournalId) ?? journalList[0];
  const isLocked = activeJournal?.locked && !unlockedIds.has(activeJournal.id);

  const unlockJournal = async (id: string): Promise<boolean> => {
    const success = await authenticate();
    if (success) setUnlockedIds((prev) => new Set(prev).add(id));
    return success;
  };

  const handleSelectJournal = async (id: string) => {
    const journal = journalList.find((j) => j.id === id);
    if (journal?.locked && !unlockedIds.has(id)) {
      if (!(await unlockJournal(id))) return;
    }
    setSelectedJournalId(id);
  };

  const [bookmarkOnly, setBookmarkOnly] = useState(false);
  const [showDeleteAllAlert, setShowDeleteAllAlert] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("tabs.journal"),
          headerLargeTitleEnabled: true,
          unstable_headerLeftItems: () => [
            {
              type: "button",
              label: t("purchases.title"),
              icon: { type: "image", source: appIcon, tinted: false },
              onPress: () => router.push("/(journal)/paywall"),
            },
          ],
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t("journal.newJournal"),
              icon: { type: "sfSymbol", name: "folder.badge.plus" },
              onPress: () =>
                journalLimitReached ? openPaywall() : router.push("/(journal)/create"),
            },
            ...(activeJournal
              ? [
                  {
                    type: "menu" as const,
                    label: t("common.options"),
                    icon: {
                      type: "sfSymbol" as const,
                      name: "ellipsis" as const,
                    },
                    menu: {
                      title: activeJournal.name,
                      items: [
                        ...(activeJournal.locked
                          ? [
                              {
                                type: "action" as const,
                                icon: {
                                  type: "sfSymbol" as const,
                                  name: isLocked ? ("lock" as const) : ("lock.open" as const),
                                },
                                label: isLocked ? t("journal.unlock") : t("journal.lock"),
                                onPress: async () => {
                                  if (isLocked) {
                                    await unlockJournal(activeJournal.id);
                                  } else {
                                    setUnlockedIds((prev) => {
                                      const next = new Set(prev);
                                      next.delete(activeJournal.id);
                                      return next;
                                    });
                                  }
                                },
                              },
                            ]
                          : []),
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: bookmarkOnly ? ("bookmark" as const) : ("bookmark.fill" as const),
                          },
                          label: bookmarkOnly ? t("journal.showAll") : t("journal.bookmarkedOnly"),
                          disabled: isLocked,
                          onPress: () => setBookmarkOnly((prev) => !prev),
                        },
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: "ellipsis.circle" as const,
                          },
                          label: t("common.edit"),
                          disabled: isLocked,
                          onPress: () => {
                            router.push(`/(journal)/edit?journalId=${activeJournal.id}`);
                          },
                        },
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: "square.and.arrow.up.on.square" as const,
                          },
                          label: t("entry.exportAllEntry"),
                          state: "off" as const,
                          disabled: isLocked,
                          onPress: async () => {
                            await exportJournalEntries(activeJournal.id, activeJournal.name);
                          },
                        },
                        {
                          type: "action" as const,
                          label: t("journal.deleteAllEntries"),
                          icon: {
                            type: "sfSymbol" as const,
                            name: "trash" as const,
                          },
                          state: "off" as const,
                          destructive: true,
                          onPress: () => setShowDeleteAllAlert(true),
                        },
                      ],
                    },
                  },
                ]
              : []),
          ],
        }}
      />
      {activeJournal ? (
        <EntryListView
          journals={journalList}
          activeJournal={activeJournal}
          onSelectJournal={handleSelectJournal}
          bookmarkOnly={bookmarkOnly}
          chipScrollKey={chipScrollKey}
          locked={isLocked}
          onUnlock={() => unlockJournal(activeJournal.id)}
        />
      ) : null}

      <Host matchContents>
        <Alert
          title={t("journal.deleteAllEntriesTitle", { name: activeJournal?.name })}
          isPresented={showDeleteAllAlert}
          onIsPresentedChange={setShowDeleteAllAlert}
        >
          <Alert.Trigger>
            <Text>{""}</Text>
          </Alert.Trigger>
          <Alert.Message>
            <Text>{t("journal.deleteConfirm")}</Text>
          </Alert.Message>
          <Alert.Actions>
            <Button label={t("common.cancel")} role="cancel" />
            <Button
              label={t("journal.deleteAll")}
              role="destructive"
              onPress={() => {
                if (activeJournal) deleteAllEntries(activeJournal.id).catch(console.error);
              }}
            />
          </Alert.Actions>
        </Alert>
      </Host>
    </>
  );
}
