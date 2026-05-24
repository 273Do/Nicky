import { Keyboard, PlatformColor } from "react-native";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { getJournalDetailQuery } from "@/db/queries/journals";
import { FieldObj } from "@/db/schemas";
import {
  FieldDraftObj,
  useJournalField,
} from "@/utils/journal/use-journal-field";

type JournalDetail = NonNullable<
  Awaited<ReturnType<typeof getJournalDetailQuery>>
>;

type FormProps = {
  journal: JournalDetail;
};

/**
 * ジャーナル編集フォーム（journal ロード後にマウントして初期値を確定させる）
 */
function JournalEditForm({ journal }: FormProps) {
  const router = useRouter();

  const { name, icon, color } = journal;

  const initialMeta = { name, icon, color };

  const initialFields: FieldDraftObj[] = [...journal.fields]
    .sort((a: FieldObj, b: FieldObj) => a.sortOrder - b.sortOrder)
    .map((f: FieldObj) => ({ id: f.id, type: f.type, label: f.label }));

  const {
    fields,
    addField,
    renameField,
    deleteField,
    moveField,
    meta,
    setMeta,
    updateJournal,
    formDisabled,
  } = useJournalField({
    meta: initialMeta,
    fields: initialFields,
  });

  const handleSave = async () => {
    Keyboard.dismiss();
    await updateJournal(journal.id);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: journal.name,
          headerLargeTitleEnabled: false,
          unstable_headerRightItems: () => [
            {
              type: "button" as const,
              label: "Save",
              icon: { type: "sfSymbol" as const, name: "checkmark" },
              tintColor: formDisabled
                ? PlatformColor("tertiaryLabel")
                : PlatformColor("systemIndigo"),
              variant: formDisabled ? undefined : "prominent",
              disabled: formDisabled,
              onPress: formDisabled ? () => {} : handleSave,
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

/**
 * ジャーナル編集
 */
export default function JournalEditScreen() {
  const { journalId } = useLocalSearchParams<{ journalId: string }>();
  const { data: journal } = useLiveQuery(getJournalDetailQuery(journalId));

  return <>{journal && <JournalEditForm journal={journal} />}</>;
}
