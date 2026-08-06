import { useState } from "react";
import { Keyboard, PlatformColor } from "react-native";

import { Alert, Button, Host, Text } from "@expo/ui/swift-ui";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { deleteJournal, getJournalDetailQuery } from "@/db/queries/journals";
import { FieldObj } from "@/db/schemas";
import { FieldDraftObj, useJournalField } from "@/utils/journal/use-journal-field";

type JournalDetail = NonNullable<Awaited<ReturnType<typeof getJournalDetailQuery>>>;

type FormProps = {
  journal: JournalDetail;
};

/**
 * ジャーナル編集フォーム（journal ロード後にマウントして初期値を確定させる）
 */
function JournalEditForm({ journal }: FormProps) {
  const router = useRouter();
  const [showDeleteAllAlert, setShowDeleteAllAlert] = useState(false);

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

  const handleDelete = async () => {
    await deleteJournal(journal.id);
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
              type: "menu" as const,
              label: "Options",
              icon: {
                type: "sfSymbol" as const,
                name: "ellipsis" as const,
              },
              menu: {
                items: [
                  {
                    type: "action" as const,
                    icon: {
                      type: "sfSymbol" as const,
                      name: "square.and.arrow.up" as const,
                    },
                    label: "Export",
                    state: "off" as const,
                    onPress: () => {
                      console.log("Export", journal.name);
                    },
                  },
                  {
                    type: "action" as const,
                    label: "Delete Journal",
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
            {
              type: "button",
              label: "Save",
              icon: { type: "sfSymbol", name: "checkmark" },
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

      <Host matchContents>
        <Alert
          title={`Delete "${journal.name}" Journal`}
          isPresented={showDeleteAllAlert}
          onIsPresentedChange={setShowDeleteAllAlert}
        >
          <Alert.Trigger>
            <Text>{""}</Text>
          </Alert.Trigger>
          <Alert.Message>
            <Text>All entries in this journal will be permanently deleted.</Text>
          </Alert.Message>
          <Alert.Actions>
            <Button label="Cancel" role="cancel" />
            <Button label="Delete" role="destructive" onPress={handleDelete} />
          </Alert.Actions>
        </Alert>
      </Host>
    </>
  );
}

/**
 * ジャーナル編集
 */
export default function JournalEditScreen() {
  const { journalId } = useLocalSearchParams<{ journalId: string }>();
  const { data: journal } = useLiveQuery(getJournalDetailQuery(journalId), [journalId]);

  return <>{journal && <JournalEditForm journal={journal} />}</>;
}
