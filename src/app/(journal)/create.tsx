import { Keyboard, PlatformColor } from "react-native";

import * as Crypto from "expo-crypto";
import { Stack, useRouter } from "expo-router";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { importJournal } from "@/utils/days/import-journal";
import { setCreatedJournalId } from "@/utils/journal/created-journal";
import { useJournalField } from "@/utils/journal/use-journal-field";

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

  const handleJournalCreate = async () => {
    Keyboard.dismiss();

    const { id } = await createJournal();
    setCreatedJournalId(id);
    router.back();
  };

  const importJournalTemplate = async () => {
    const journal = await importJournal();

    if (!journal) return;

    const { name, color, icon, fields } = journal;

    setMeta({ name, color, icon });
    setFields(fields.map(({ type, label }) => ({ id: Crypto.randomUUID(), type, label })));
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
