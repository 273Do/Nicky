import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, PlatformColor } from "react-native";

import * as Crypto from "expo-crypto";
import { Stack, useRouter } from "expo-router";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { useJournalField } from "@/hooks/journal/use-journal-field";
import { handleSaveError } from "@/utils/handle-save-error";
import { setCreatedJournalId } from "@/utils/journal/created-journal";
import { importJournal } from "@/utils/journal/import-journal";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  const { t } = useTranslation();
  const router = useRouter();

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

    const { name, color, icon, fields } = journal;

    setMeta({ name, color, icon });
    setFields(fields.map(({ type, label }) => ({ id: Crypto.randomUUID(), type, label })));
    setImportKey((prev) => prev + 1);
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
