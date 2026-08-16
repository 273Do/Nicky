import { useState } from "react";
import { Alert, Keyboard, PlatformColor } from "react-native";

import * as Crypto from "expo-crypto";
import { Stack, useRouter } from "expo-router";
import { z } from "zod";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { useJournalField } from "@/hooks/journal/use-journal-field";
import { importJournal } from "@/utils/days/import-journal";
import { setCreatedJournalId } from "@/utils/journal/created-journal";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  const router = useRouter();

  const {
    fields,
    setFields,
    addField,
    renameField,
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
      if (error instanceof z.ZodError) {
        Alert.alert("Validation Error", error.issues[0].message);
      }
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
          title: "New Journal",
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: "Import Journal",
              icon: { type: "sfSymbol", name: "square.and.arrow.down" },
              onPress: importJournalTemplate,
            },
            {
              type: "button",
              label: "Save",
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
        deleteField={deleteField}
        moveField={moveField}
        meta={meta}
        setMeta={setMeta}
      />
    </>
  );
}
