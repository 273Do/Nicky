import { Keyboard, PlatformColor } from "react-native";

import { Stack, useRouter } from "expo-router";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { useJournalField } from "@/utils/journal/use-journal-field";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  const router = useRouter();

  const {
    fields,
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
    const { id: newJournalId, name } = await createJournal();

    // replace でスタックせずにジャーナル詳細画面からジャーナル一覧へ戻れるようにする
    router.replace(`/(journal)/${newJournalId}?name=${name}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "New Journal",
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: "Save",
              icon: { type: "sfSymbol", name: "checkmark" },
              tintColor: formDisabled
                ? PlatformColor("tertiaryLabel")
                : PlatformColor("systemIndigo"),
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
