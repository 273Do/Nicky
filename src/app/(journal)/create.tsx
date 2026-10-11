import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Keyboard, PlatformColor } from "react-native";

import * as Crypto from "expo-crypto";
import { Stack, useRouter } from "expo-router";
import { z } from "zod";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { JOURNAL_ICONS } from "@/constants/journal";
import { useJournalField } from "@/hooks/journal/use-journal-field";
import { useSubscription } from "@/hooks/purchases/use-subscription";
import { useValidatedParams } from "@/hooks/use-validated-params";
import { handleSaveError } from "@/utils/handle-save-error";
import { setCreatedJournalId } from "@/utils/journal/created-journal";
import { importJournal, importJournalFromLink } from "@/utils/journal/import-journal";
import type { JournalTemplate } from "@/utils/journal/import-journal";
import { isFreeIcon, isProFieldType } from "@/utils/purchases/pro-gate";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isPro, loading } = useSubscription();

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

  /**
   * 読み込んだジャーナルをフォームに反映する（ファイル・リンク共通）
   * @param journal 署名の検証済みのジャーナル
   */
  const applyImportedJournal = (journal: JournalTemplate) => {
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

  const importJournalTemplate = async () => {
    // 購読状態の確定前は Pro ユーザーの設定を誤って外してしまうため読み込まない
    if (loading) return;

    const journal = await importJournal();

    if (journal) applyImportedJournal(journal);
  };

  // 共有リンクから開かれた場合
  const { t: linkData } = useValidatedParams(z.object({ t: z.string().optional() }));
  const linkHandled = useRef(false);

  const importFromLink = useEffectEvent(async (encoded: string) => {
    // 再描画や戻ってきたときに再び読み込まないようパラメータを消す
    router.setParams({ t: undefined });

    const journal = await importJournalFromLink(encoded);

    if (journal) applyImportedJournal(journal);
  });

  // 署名の検証が非同期のため、初期値としては渡せず、結果を受け取ってからフォームに反映する。
  // 購読状態の確定前は Pro ユーザーの設定を誤って外してしまうため、確定を待つ
  useEffect(() => {
    if (!linkData || loading || linkHandled.current) return;
    linkHandled.current = true;
    void importFromLink(linkData);
  }, [linkData, loading]);

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
              disabled: loading,
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
