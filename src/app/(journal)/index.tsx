import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert, Button, Host, Text } from "@expo/ui/swift-ui";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useFocusEffect, useRouter } from "expo-router";

import { EntryListView } from "@/components/entry/entry-list-view";
import { db } from "@/db/client";
import { deleteAllEntries } from "@/db/queries/entries";
import { getJournalsQuery, JournalWithCountObj } from "@/db/queries/journals";
import { settings } from "@/db/schemas";
import { consumeCreatedJournalId } from "@/utils/journal/created-journal";

/**
 * ジャーナル画面（チップ切り替え + エントリー一覧）
 */
export default function JournalScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const onboardingNavigated = useRef(false);

  if (!onboardingNavigated.current) {
    const rows = db.select().from(settings).where(eq(settings.key, "onboarding_completed")).get();
    if (rows?.value !== "true") {
      onboardingNavigated.current = true;
      router.push("/(journal)/onboarding");
    }
  }

  const { data: journals } = useLiveQuery(getJournalsQuery);
  const journalList: JournalWithCountObj[] = journals ?? [];

  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [chipScrollKey, setChipScrollKey] = useState(0);

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

  const [bookmarkOnly, setBookmarkOnly] = useState(false);
  const [showDeleteAllAlert, setShowDeleteAllAlert] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("tabs.journal"),
          headerLargeTitleEnabled: true,
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t("journal.newJournal"),
              icon: { type: "sfSymbol", name: "folder.badge.plus" },
              onPress: () => router.push("/(journal)/create"),
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
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: bookmarkOnly ? ("bookmark" as const) : ("bookmark.fill" as const),
                          },
                          label: bookmarkOnly ? t("journal.showAll") : t("journal.bookmarkedOnly"),
                          onPress: () => setBookmarkOnly((prev) => !prev),
                        },
                        {
                          type: "action" as const,
                          icon: {
                            type: "sfSymbol" as const,
                            name: "ellipsis.circle" as const,
                          },
                          label: t("common.edit"),
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
                          label: t("entry.export"),
                          state: "off" as const,
                          onPress: () => {
                            console.log("Export", activeJournal?.name);
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
          activeJournalId={activeJournal.id}
          onSelectJournal={setSelectedJournalId}
          journalName={activeJournal.name}
          bookmarkOnly={bookmarkOnly}
          chipScrollKey={chipScrollKey}
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
