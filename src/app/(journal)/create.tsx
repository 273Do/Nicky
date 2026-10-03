import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard, PlatformColor } from "react-native";

import * as Crypto from "expo-crypto";
import { Stack, useRouter } from "expo-router";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { JOURNAL_ICONS } from "@/constants/journal";
import { useJournalField } from "@/hooks/journal/use-journal-field";
import { useSubscription } from "@/hooks/purchases/use-subscription";
import { handleSaveError } from "@/utils/handle-save-error";
import { setCreatedJournalId } from "@/utils/journal/created-journal";
import { importJournal } from "@/utils/journal/import-journal";
import { isFreeIcon, isProFieldType } from "@/utils/purchases/pro-gate";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isPro } = useSubscription();

  const {
    fields,
    setFields,
    addField,
    renameField,
    updateRatingRange,
    deleteField,
    moveField,
    meta,
    setMeta,
    createJournal,
    formDisabled,
  } = useJournalField();

  const [importKey, setImportKey] = useState(0);

  const handleJournalCreate = async () => {
    Keyboard.dismiss();

    try {
      const { id } = await createJournal();
      setCreatedJournalId(id);
      router.back();
    } catch (error) {
      handleSaveError(error);
    }
  };

  const importJournalTemplate = async () => {
    const journal = await importJournal();

    if (!journal) return;

    const { name, color, icon, oneEntry, locked, notificationTime, fields } = journal;

    // 無料プランでは Pro 限定の設定を外す（アイコンはデフォルト、Pro 限定フィールドは削除）
    const iconAllowed = isPro || isFreeIcon(icon);
    const allowedFields = fields.filter(({ type }) => isPro || !isProFieldType(type));

    setMeta({
      name,
      color,
      icon: iconAllowed ? icon : JOURNAL_ICONS[0],
      oneEntry: isPro && oneEntry,
      locked: isPro && locked,
      notificationTime,
    });
    setFields(allowedFields.map(({ type, label }) => ({ id: Crypto.randomUUID(), type, label })));
    setImportKey((prev) => prev + 1);

    const removed =
      !iconAllowed || allowedFields.length < fields.length || (!isPro && (oneEntry || locked));

    if (removed) {
      Alert.alert(t("purchases.importLimitedTitle"), t("purchases.importLimitedMessage"), [
        { text: t("common.ok"), style: "cancel" },
        { text: t("purchases.unlock"), onPress: () => router.navigate("/(journal)/paywall") },
      ]);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("journal.newJournal"),
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t("journal.import"),
              icon: { type: "sfSymbol", name: "square.and.arrow.down" },
              onPress: importJournalTemplate,
            },
            {
              type: "button",
              label: t("common.save"),
              icon: { type: "sfSymbol", name: "checkmark" },
              tintColor: formDisabled
                ? PlatformColor("tertiaryLabel")
                : PlatformColor("systemIndigo"),
              variant: "prominent",
              disabled: formDisabled,
              onPress: formDisabled ? () => {} : handleJournalCreate,
            },
          ],
        }}
      />
      <JournalCreateView
        key={importKey}
        fields={fields}
        addField={addField}
        renameField={renameField}
        updateRatingRange={updateRatingRange}
        deleteField={deleteField}
        moveField={moveField}
        meta={meta}
        setMeta={setMeta}
      />
    </>
  );
}
