import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, PlatformColor } from "react-native";

import { Alert, Button, Host, Text } from "@expo/ui/swift-ui";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useRouter } from "expo-router";
import { z } from "zod";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { deleteJournal, getJournalDetailQuery, JournalDetail } from "@/db/queries/journals";
import { FieldObj } from "@/db/schemas";
import { FieldDraftObj, useJournalField } from "@/hooks/journal/use-journal-field";
import { useValidatedParams } from "@/hooks/use-validated-params";
import { exportJournal } from "@/utils/days/export-journal";
import { handleSaveError } from "@/utils/handle-save-error";

type FormProps = {
  journal: JournalDetail;
};

/**
 * ジャーナル編集フォーム（journal ロード後にマウントして初期値を確定させる）
 */
function JournalEditForm({ journal }: FormProps) {
  const { t } = useTranslation();
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

    try {
      await updateJournal(journal.id);
      router.back();
    } catch (error) {
      handleSaveError(error);
    }
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
              type: "menu",
              label: t("common.options"),
              icon: {
                type: "sfSymbol",
                name: "ellipsis",
              },
              menu: {
                items: [
                  {
                    type: "action",
                    icon: {
                      type: "sfSymbol",
                      name: "square.and.arrow.up",
                    },
                    label: t("journal.share"),
                    state: "off",
                    onPress: async () => await exportJournal(journal),
                  },
                  {
                    type: "action",
                    label: t("journal.deleteJournal"),
                    icon: {
                      type: "sfSymbol",
                      name: "trash",
                    },
                    state: "off",
                    destructive: true,
                    onPress: () => setShowDeleteAllAlert(true),
                  },
                ],
              },
            },
            {
              type: "button",
              label: t("common.save"),
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
          title={t("journal.deleteJournalTitle", { name: journal.name })}
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
            <Button label={t("common.delete")} role="destructive" onPress={handleDelete} />
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
  const schema = z.object({ journalId: z.string() });
  const { journalId } = useValidatedParams(schema);

  const { data: journal } = useLiveQuery(getJournalDetailQuery(journalId), [journalId]);

  return <>{journal && <JournalEditForm journal={journal} />}</>;
}
