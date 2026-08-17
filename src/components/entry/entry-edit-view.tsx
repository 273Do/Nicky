import { useTranslation } from "react-i18next";
import { Keyboard, PlatformColor } from "react-native";

import { Stack } from "expo-router";

import { EntryCreateView } from "@/components/entry/entry-create-view";
import { type EntryDetailObj } from "@/db/queries/entries";
import { useEntry } from "@/hooks/entry/use-entry";
import { buildEntryFormData } from "@/utils/entry/entry-form";
import { handleSaveError } from "@/utils/handle-save-error";

/**
 * 編集フォーム — editMode 切替時にマウント/アンマウントされ、useRef が毎回初期化される
 */
export function EntryEditView({
  entry,
  onSave,
  onCancel,
}: {
  entry: EntryDetailObj;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const { fields, initialValues } = buildEntryFormData(entry);
  const { valuesRef, setValue, updateEntry } = useEntry(fields, initialValues);

  const handleSave = async () => {
    try {
      Keyboard.dismiss();
      await updateEntry(entry.id);
      onSave();
    } catch (error) {
      handleSaveError(error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t("common.cancel"),
              onPress: onCancel,
            },
            {
              type: "button",
              label: t("common.save"),
              icon: { type: "sfSymbol", name: "checkmark" },
              tintColor: PlatformColor("systemIndigo"),
              variant: "prominent",
              onPress: handleSave,
            },
          ],
        }}
      />
      <EntryCreateView
        id={entry.journalId}
        values={valuesRef.current}
        setValue={setValue}
        createdAt={entry.createdAt}
      />
    </>
  );
}
